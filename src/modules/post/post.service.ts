import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

type GetPostsParams = {
	search: string | undefined;
	tags: string[];
	isFeatured: boolean | undefined;
	status: PostStatus | undefined;
	authorId: string | undefined;
	page: number;
	limit: number;
	skip: number;
	sortBy: string | undefined;
	sortOrder: string | undefined;
};

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

const getPosts = async ({
	search,
	tags,
	isFeatured,
	status,
	authorId,
	page,
	limit,
	skip,
	sortBy,
	sortOrder,
}: GetPostsParams) => {
	const queryConditions: PostWhereInput[] = [];

	if (search) {
		queryConditions.push({
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
		queryConditions.push({
			tags: {
				hasEvery: tags,
			},
		});
	}

	if (typeof isFeatured === "boolean") {
		queryConditions.push({
			isFeatured,
		});
	}

	if (status === "ARCHIVED" || status === "DRAFT" || status === "PUBLISHED") {
		queryConditions.push({
			status,
		});
	}

	if (authorId) {
		queryConditions.push({
			authorId,
		});
	}

	const result = await prisma.post.findMany({
		take: limit,
		skip,
		where: {
			AND: queryConditions.length > 0 ? queryConditions : [],
		},
		orderBy:
			sortBy && sortOrder
				? {
						[sortBy]: sortOrder,
				  }
				: { createdAt: "asc" },
	});

	return result;
};

export const PostService = {
	createPost,
	getPosts,
};
