import { NextFunction, Request, Response } from "express";

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
	res.status(500);
	res.json({
		message: "Error from error handler",
		error: err,
	});
}

export default errorHandler;
