import { Router } from "express";
import { auth, UserRole } from "../../middlewares/auth";
import { CommentController } from "./comment.controller";

const router = Router();

router.post("/", auth(UserRole.ADMIN, UserRole.USER), CommentController.createComment);

export const commentRouter = router;
