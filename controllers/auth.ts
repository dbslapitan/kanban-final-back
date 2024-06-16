import { NextFunction, Request, Response } from "express";
import { User } from "../schemas/user";
import { Board } from "../schemas/board";

export const getFirstBoardName = async (request: Request, response: Response, next: NextFunction) => {


    try {
        const user = await User.findOne({username: request.params.username});
        if(user){
            const boards = await Board.find({owner: user.username});
            if(boards.length){
                response.status(200).json(boards[0].slugified);
            }
            else{
                response.sendStatus(204);
            }
        }
        else{
            response.sendStatus(404);
        }
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}