import { Router } from "express";
import { auth, UserRole } from "../../middlewares/auth";
import { PostController } from "./post.controller";

const router = Router();

router.get("/", PostController.getPosts);

router.get("/my-posts", auth(UserRole.ADMIN, UserRole.USER), PostController.getMyPosts);

router.get("/:postId", PostController.getPostById);

router.post("/", auth(UserRole.ADMIN, UserRole.USER), PostController.createPost);

export const postRouter = router;
