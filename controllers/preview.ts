import { NextFunction, Request, Response } from 'express';
import { Board } from '../schemas/board';

export const getFirstPreviewBoardName = async (request: Request, response: Response, next: NextFunction) => {
    try{
        const boards = await Board.find({owner: 'preview'});
        if(boards.length){
            response.status(200).json(boards[0].slugified);
        }
        else{
            response.sendStatus(204);
        }
    }
    catch(e){
        console.log(e);
        response.status(500).json(e);
    }
}