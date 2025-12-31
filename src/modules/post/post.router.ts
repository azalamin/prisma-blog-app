import { Router } from "express";
import { auth, UserRole } from "../../middlewares/auth";
import { PostController } from "./post.controller";

const router = Router();

router.post("/", auth(UserRole.ADMIN, UserRole.USER), PostController.createPost);
router.get("/", PostController.getPosts);

export const postRouter = router;
