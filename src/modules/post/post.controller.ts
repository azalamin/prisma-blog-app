import { Request, Response } from "express";
import { PostService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
	try {
		const result = await PostService.createPost(req.body);
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
		const result = await PostService.getPosts();
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
