import { Router } from "express";
import { auth, UserRole } from "../../middlewares/auth";
import { CommentController } from "./comment.controller";

const router = Router();

router.get(
	"/author/:authorId",
	auth(UserRole.ADMIN, UserRole.USER),
	CommentController.getCommentsByAuthor
);
router.get("/:commentId", auth(UserRole.ADMIN, UserRole.USER), CommentController.getCommentById);

router.post("/", auth(UserRole.ADMIN, UserRole.USER), CommentController.createComment);

router.delete("/:commentId", auth(UserRole.USER, UserRole.ADMIN), CommentController.deleteComment);

router.patch("/:commentId", auth(UserRole.USER, UserRole.ADMIN), CommentController.updateComment);
router.patch("/:commentId/moderate", auth(UserRole.ADMIN), CommentController.moderateComment);

export const commentRouter = router;
