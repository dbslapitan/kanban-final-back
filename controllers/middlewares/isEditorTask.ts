import { NextFunction, Request, Response } from "express";
import { Column, IColumn } from "../../schemas/column";
import { Board, IBoard } from "../../schemas/board";
import { Task } from "../../schemas/task";

export const isEditorTask = async (request: Request, response: Response, next: NextFunction) => {
    try{
        const column = await Column.findById(request.body.status).populate('boardId');
        if((column?.boardId as IBoard).editors.includes(request.auth?.payload.username as string) || (column?.boardId as IBoard).owner === request.auth?.payload.username){
            return next();
        }
        else{
            return response.sendStatus(401);
        }
    }
    catch(e){
        console.error(e);
        response.sendStatus(500);
    }
};

export const isEditorTaskId = async (request: Request, response: Response, next: NextFunction) => {
    try{
        const task = await Task.findById(request.params.id).populate({path: 'status', model: Column, populate: {path: 'boardId', model: Board}});
        if(((task?.status as IColumn).boardId as IBoard).editors.includes(request.auth?.payload.username as string) || ((task?.status as IColumn).boardId as IBoard).owner === request.auth?.payload.username){
            return next();
        }
        else{
            return response.sendStatus(401);
        }
    }
    catch(e){
        console.error(e);
        response.sendStatus(500);
    }
};