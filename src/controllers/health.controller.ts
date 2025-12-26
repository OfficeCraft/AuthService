import { Request, Response } from "express";

export function healthCheckController(req: Request, res: Response) {
    res.status(200).json({ status: "OK", message: "Auth service is healthy" });
}