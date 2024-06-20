import { NextFunction, Request, Response } from "express";
import { Board } from "../../schemas/board";

export const isOwnerBoardSlug = async (request: Request, response: Response, next: NextFunction) => {

    if(request.auth?.payload.username === request.params.username){
        return next();
    }
    else{
        response.sendStatus(401);
    }
};

export const isOwnerBoardId = async (request: Request, response: Response, next: NextFunction) => {

    const {id: boardId} = request.params;
    try{
        const board = await Board.findById(boardId);
        if(board?.owner === request.auth?.payload.username){
            return next();
        }
        else{
            response.sendStatus(401);
        }
    }
    catch(e){
        console.error(e);
        response.sendStatus(500);
    }
};