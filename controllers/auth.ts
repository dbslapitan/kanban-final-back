import { NextFunction, Request, Response } from "express";
import { User } from "../schemas/user";
import { Board } from "../schemas/board";
import slugify from "slugify";
import getRandomColor from "../libs/randomColor";
import { Column } from "../schemas/column";

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

export const getBoardNames = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const {username} = request.params;
        const user = await User.findOne({username});
        if(user){
            const boards = await Board.find({owner: user.username}).select('name slugified');
            response.status(200).json(boards);
        }
        else{
            response.status(404).json('Username does not exist.');
        }
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}

export const postBoard = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { name, columns } = request.body;
        const {username} = request.params;
        const slugified = slugify(name, { lower: true, strict: true });
        const board = await Board.findOne({slugified, owner: request.auth?.payload.username});
        if (board) {
            return response.status(400).json('Already have a board with the same name.');
        }
        const { _id } = await Board.create({ name, owner: request.auth?.payload.username, editors: [], slugified });
        for (const column of columns) {
            await Column.create({ name: column, boardId: _id, color: getRandomColor() });
        }
        response.status(201).json(slugified);
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}