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

export const CommentService = {
	createComment,
	getCommentById,
	getCommentsByAuthor,
};
