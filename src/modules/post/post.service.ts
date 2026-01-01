import { Post, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (
	data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
	userId: string
) => {
	data.tags.map(tag => tag.toLocaleLowerCase);
	const result = await prisma.post.create({
		data: {
			...data,
			authorId: userId,
		},
	});

	return result;
};

const getPosts = async (search: string) => {
	const where: Prisma.PostWhereInput = {};

	if (search) {
		const normalized = search.toLocaleLowerCase();

		where.OR = [
			{
				title: {
					contains: search,
					mode: "insensitive",
				},
			},
			{
				content: {
					contains: search,
					mode: "insensitive",
				},
			},
			{
				tags: {
					has: normalized,
				},
			},
		];
	}

	return await prisma.post.findMany({ where });
};

export const PostService = {
	createPost,
	getPosts,
};
