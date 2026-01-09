import { NextFunction, Request, RequestHandler, Response } from "express";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middlewares/auth";
import { PostService } from "./post.service";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.user) {
			return res.status(400).json({
				success: false,
				message: "Unauthorized access!",
			});
		}
		const result = await PostService.createPost(req.body, req.user?.id as string);
		res.status(201).json({
			success: true,
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const getPosts = async (req: Request, res: Response) => {
	try {
		const { search } = req.query;
		const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
		const searchString = typeof search === "string" ? search : undefined;

		// true or false
		const isFeatured = req.query.isFeatured
			? req.query.isFeatured === "true"
				? true
				: req.query.isFeatured === "false"
				? false
				: undefined
			: undefined;

		const status = req.query.status as PostStatus | undefined;

		const authorId = req.query.authorId as string | undefined;

		const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);

		const result = await PostService.getPosts({
			search: searchString,
			tags,
			isFeatured,
			status,
			authorId,
			page,
			limit,
			skip,
			sortBy,
			sortOrder,
		});

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			error: "Post retrieve failed",
			details: error,
		});
	}
};

const getPostById = async (req: Request, res: Response) => {
	try {
		const { postId } = req.params;
		if (!postId) {
			throw new Error("Post id is required!");
		}
		const result = await PostService.getPostById(postId);
		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			error: "Post retrieve failed",
			details: error,
		});
	}
};

const getMyPosts = async (req: Request, res: Response) => {
	try {
		const user = req.user;

		if (!user) {
			throw new Error("You are unauthorized!");
		}
		const result = await PostService.getMyPosts(user.id as string);

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Post fetch failed!";
		res.status(400).json({
			error: errorMessage,
			details: error,
		});
	}
};

const updatePost: RequestHandler = async (req, res) => {
	try {
		const { postId } = req.params;
		const user = req.user;
		if (!user) {
			throw new Error("You are unauthorized!");
		}

		const isAdmin = user.role === UserRole.ADMIN;

		const result = await PostService.updatePost(
			postId as string,
			req.body,
			user.id as string,
			isAdmin
		);
		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Post update failed";
		res.status(400).json({
			error: errorMessage,
			details: error,
		});
	}
};

const deletePost: RequestHandler = async (req, res) => {
	try {
		const { postId } = req.params;
		const user = req.user;

		if (!user) {
			throw new Error("You are not authorized! ");
		}

		const isAdmin = user.role === UserRole.ADMIN;

		const result = await PostService.deletePost(postId as string, user.id, isAdmin);

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Post delete failed";
		res.status(400).json({
			error: errorMessage,
			details: error,
		});
	}
};

const getStats: RequestHandler = async (req, res) => {
	try {
		const result = await PostService.getStats();

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Stats fetched failed";
		res.status(400).json({
			error: errorMessage,
			details: error,
		});
	}
};

export const PostController = {
	createPost,
	getPosts,
	getPostById,
	getMyPosts,
	updatePost,
	deletePost,
	getStats,
};
