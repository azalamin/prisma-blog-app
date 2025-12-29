import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application } from "express";

import { auth } from "./lib/auth";
import { postRouter } from "./modules/post/post.router";

const app: Application = express();

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(cors());
app.use(express.json());

app.use("/posts", postRouter);

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

export default app;
