import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

type CommentData = {
	content: string;
	authorId: string;
	postId: string;
	parentId?: string;
};

const createComment = async (payload: CommentData) => {
	await prisma.post.findUniqueOrThrow({
		where: {
			id: payload.postId,
		},
	});

	if (payload.parentId) {
		await prisma.comment.findUniqueOrThrow({
			where: {
				id: payload.parentId,
			},
		});
	}

	return await prisma.comment.create({
		data: payload,
	});
};

const getCommentById = async (id: string) => {
	return await prisma.comment.findUnique({
		where: {
			id,
		},
		include: {
			post: {
				select: {
					id: true,
					title: true,
					views: true,
				},
			},
		},
	});
};

const getCommentsByAuthor = async (authorId: string) => {
	return await prisma.comment.findMany({
		where: {
			authorId,
		},
		orderBy: { createdAt: "desc" },
		include: {
			post: {
				select: {
					id: true,
					title: true,
				},
			},
		},
	});
};

const deleteComment = async (commentId: string, authorId: string) => {
	const commentData = await prisma.comment.findFirst({
		where: {
			id: commentId,
			authorId,
		},
		select: {
			id: true,
		},
	});

	if (!commentData) {
		throw new Error("Your provided input is invalid!");
	}

	return await prisma.comment.delete({
		where: {
			id: commentData.id,
		},
	});
};

const updateComment = async (
	commentId: string,
	data: { content?: string; status?: CommentStatus },
	authorId: string
) => {
	const commentData = await prisma.comment.findFirst({
		where: {
			id: commentId,
			authorId,
		},
		select: {
			id: true,
		},
	});

	if (!commentData) {
		throw new Error("Your provided input is invalid!");
	}

	return await prisma.comment.update({
		where: {
			id: commentData.id,
			authorId,
		},
		data,
	});
};

const moderateComment = async (commentId: string, data: { status: CommentStatus }) => {
	const commentData = await prisma.comment.findUniqueOrThrow({
		where: {
			id: commentId,
		},
	});

	if (commentData.status === data.status) {
		throw new Error(`Your provided status (${data.status}) is up to date!`);
	}

	return await prisma.comment.update({
		where: {
			id: commentId,
		},
		data,
	});
};

export const CommentService = {
	createComment,
	getCommentById,
	getCommentsByAuthor,
	deleteComment,
	updateComment,
	moderateComment,
};
