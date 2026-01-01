import { Request, Response } from "express";
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
		const isFeatured = req.query.isFeatured ? req.query.isFeatured === "true" : undefined;

		const result = await PostService.getPosts({ search: searchString, tags, isFeatured });
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

export const PostController = {
	createPost,
	getPosts,
};
