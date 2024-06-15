import { NextFunction, Request, Response } from "express";
import { User } from "../schemas/user";

export const postUser = async (request: Request, response: Response, next: NextFunction) => {

    try {
        console.log('got here');
        const user = await User.create(request.body);
        response.status(201).json(user._id);
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}