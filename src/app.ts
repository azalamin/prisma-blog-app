import cors from "cors";
import express, { Application } from "express";

const app: Application = express();

app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
	})
);
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

export default app;
