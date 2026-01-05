type CommentData = {
	content: string;
	authorId: string;
	postId: string;
	parentId?: string;
};

const createComment = async (payload: CommentData) => {
	console.log(payload);
};

export const CommentService = {
	createComment,
};
