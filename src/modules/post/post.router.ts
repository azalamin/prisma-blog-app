import { Router } from "express";
import { auth, UserRole } from "../../middlewares/auth";
import { PostController } from "./post.controller";

const router = Router();

router.get("/", PostController.getPosts);

router.get("/stats", auth(UserRole.ADMIN), PostController.getStats);

router.get("/my-posts", auth(UserRole.ADMIN, UserRole.USER), PostController.getMyPosts);

router.get("/:postId", PostController.getPostById);

router.post("/", auth(UserRole.ADMIN, UserRole.USER), PostController.createPost);

router.patch("/:postId", auth(UserRole.ADMIN, UserRole.USER), PostController.updatePost);

router.delete("/:postId", auth(UserRole.USER, UserRole.ADMIN), PostController.deletePost);

export const postRouter = router;
