import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
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

const getPosts = async ({ search, tags }: { search: string | undefined; tags: string[] }) => {
	const andConditions: PostWhereInput[] = [];

	if (search) {
		andConditions.push({
			OR: [
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
						has: search,
					},
				},
			],
		});
	}

	if (tags.length > 0) {
		andConditions.push({
			tags: {
				hasEvery: tags,
			},
		});
	}

	const where: PostWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

	const result = await prisma.post.findMany({ where });
	return result;
};

export const PostService = {
	createPost,
	getPosts,
};
