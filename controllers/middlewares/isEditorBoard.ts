import { NextFunction, Request, Response } from "express";

export const isEditorBoard = async (request: Request, response: Response, next: NextFunction) => {
    console.log(request.auth?.payload.username);
    next();
};