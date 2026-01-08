import { Request, Response } from "express";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { PostService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
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
		res.status(400).json({
			error: "Post creation failed",
			details: error,
		});
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

export const PostController = {
	createPost,
	getPosts,
	getPostById,
	getMyPosts,
};
