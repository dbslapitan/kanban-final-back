import { NextFunction, Request, Response } from 'express';
import { Board } from '../schemas/board';
import { Column } from '../schemas/column';
import { Task } from '../schemas/task';
import slugify from 'slugify';
import getRandomColor from '../libs/randomColor';

export const getFirstPreviewBoardName = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const boards = await Board.find({ owner: 'preview' });
        if (boards.length) {
            response.status(200).json(boards[0].slugified);
        }
        else {
            response.sendStatus(204);
        }
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}

export const getPreviewBoardNames = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const boards = await Board.find({ owner: 'preview' }).select('name slugified');
        response.status(200).json(boards);
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}

export const getPreviewColumns = async (request: Request, response: Response, next: NextFunction) => {

    const { slug } = request.params;

    try {
        const board = await Board.findOne({ slugified: slug }).populate({ path: 'columns', model: Column, populate: { path: 'tasks', model: Task, select: 'title description status subtasks'}, select: 'name boardId color' });
        response.status(200).json(board?.columns);
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}

export const postPreviewBoard = async (request: Request, response: Response, next: NextFunction) => {

    const { name, columns } = request.body;

    try {
        const slugified = slugify(name, {lower: true, strict: true});
        const board = await Board.find({slugified});
        if(board.length){
            return response.status(400).json('Already have a board with the same name.');
        }
        const { _id } = await Board.create({name, owner: 'preview', editors: [], slugified});
        for(const column of columns){
            await Column.create({name: column, boardId: _id, color: getRandomColor()});
        }
        response.status(201).json(slugified);
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}

export const getPreviewBoard = async (request: Request, response: Response, next: NextFunction) => {

    const { slug } = request.params;

    try {
        const board = await Board.findOne({slugified: slug}).select('name owner');
        if(board){
            response.status(200).json(board);
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

export const deletePreviewBoard = async (request: Request, response: Response, next: NextFunction) => {

    const { id } = request.params;

    try {
        const board = await Board.findByIdAndDelete(id);
        if(board){
            const columns = await Column.find({boardId: board._id});
            const ids = columns.map(column => column._id.toHexString());
            await Column.deleteMany({boardId: board._id});
            await Task.deleteMany({status: {$in: ids}});
            response.sendStatus(204);
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