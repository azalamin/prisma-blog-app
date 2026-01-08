import { RequestHandler } from "express";
import { CommentService } from "./comment.service";

const createComment: RequestHandler = async (req, res) => {
	try {
		const user = req.user;
		req.body.authorId = user?.id;
		const result = await CommentService.createComment(req.body);
		res.status(201).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			error: "Comment creation failed",
			details: error,
		});
	}
};

const getCommentById: RequestHandler = async (req, res) => {
	try {
		const { commentId } = req.params;
		const result = await CommentService.getCommentById(commentId as string);
		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			error: "Comment fetch failed",
			details: error,
		});
	}
};

const getCommentsByAuthor: RequestHandler = async (req, res) => {
	try {
		const { authorId } = req.params;
		const result = await CommentService.getCommentsByAuthor(authorId as string);
		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			error: "Comment fetch failed",
			details: error,
		});
	}
};

const deleteComment: RequestHandler = async (req, res) => {
	try {
		const { commentId } = req.params;
		const user = req.user;
		const result = await CommentService.deleteComment(commentId as string, user?.id as string);
		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			error: "Comment delete failed",
			details: error,
		});
	}
};

const updateComment: RequestHandler = async (req, res) => {
	try {
		const { commentId } = req.params;
		const user = req.user;
		const result = await CommentService.updateComment(
			commentId as string,
			req.body,
			user?.id as string
		);
		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			error: "Comment update failed",
			details: error,
		});
	}
};

const moderateComment: RequestHandler = async (req, res) => {
	try {
		const { commentId } = req.params;
		const result = await CommentService.moderateComment(commentId as string, req.body);
		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			error: "Comment update failed",
			details: error,
		});
	}
};

export const CommentController = {
	createComment,
	getCommentById,
	getCommentsByAuthor,
	deleteComment,
	updateComment,
	moderateComment,
};
