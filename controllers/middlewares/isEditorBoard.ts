import { NextFunction, Request, Response } from "express";
import { Board } from "../../schemas/board";

export const isEditorBoardSlug = async (request: Request, response: Response, next: NextFunction) => {
    const board = await Board.findOne({owner: request.params.username, slugified: request.params.slug});
    if(board?.owner === request.auth?.payload.username || board?.editors.includes((request.auth?.payload.username as string))){
        return next();
    }
    response.sendStatus(401);
};