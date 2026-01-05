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

export const CommentService = {
	createComment,
};
