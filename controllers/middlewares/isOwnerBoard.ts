import { NextFunction, Request, Response } from "express";

export const isOwnerBoard = async (request: Request, response: Response, next: NextFunction) => {

    if(request.auth?.payload.username === request.params.username){
        next();
    }
    else{
        response.sendStatus(401);
    }
};