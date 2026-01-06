import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client";
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
	sortBy: string;
	sortOrder: string;
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

	const allPost = await prisma.post.findMany({
		take: limit,
		skip,
		where: {
			AND: queryConditions,
		},
		orderBy: {
			[sortBy]: sortOrder,
		},
		include: {
			_count: {
				select: { comments: true },
			},
		},
	});

	const total = await prisma.post.count({
		where: {
			AND: queryConditions,
		},
	});

	return {
		allPost,
		pagination: {
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		},
	};
};

const getPostById = async (postId: string) => {
	return await prisma.$transaction(async tx => {
		await tx.post.update({
			where: {
				id: postId,
			},
			data: {
				views: {
					increment: 1,
				},
			},
		});
		const postData = await tx.post.findUnique({
			where: { id: postId },
			include: {
				comments: {
					where: {
						parentId: null,
						status: CommentStatus.APPROVED,
					},
					orderBy: { createdAt: "desc" },
					include: {
						replies: {
							where: {
								status: CommentStatus.APPROVED,
							},
							orderBy: { createdAt: "asc" },
							include: {
								replies: {
									where: {
										status: CommentStatus.APPROVED,
									},
									orderBy: { createdAt: "asc" },
								},
							},
						},
					},
				},
				_count: {
					select: {
						comments: true,
					},
				},
			},
		});
		return postData;
	});
};

export const PostService = {
	createPost,
	getPosts,
	getPostById,
};
