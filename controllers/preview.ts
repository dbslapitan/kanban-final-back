import { NextFunction, Request, Response } from 'express';
import { Board, IBoard } from '../schemas/board';
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
        const board = await Board.findOne({ slugified: slug }).populate({ path: 'columns', model: Column, populate: { path: 'tasks', model: Task, select: 'title description status subtasks' }, select: 'name boardId color' });
        response.status(200).json(board?.columns);
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}

export const getPreviewColumnsMin = async (request: Request, response: Response, next: NextFunction) => {

    const { slug } = request.params;

    try {
        const board = await Board.findOne({ slugified: slug }).populate({ path: 'columns', model: Column, select: 'name boardId' });
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
        const slugified = slugify(name, { lower: true, strict: true });
        const board = await Board.findOne({ slugified, owner: 'preview' });
        if (board) {
            return response.status(400).json('Already have a board with the same name.');
        }
        const { _id } = await Board.create({ name, owner: 'preview', editors: [], slugified });
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

export const getPreviewBoard = async (request: Request, response: Response, next: NextFunction) => {

    const { slug } = request.params;

    try {
        const board = await Board.findOne({ slugified: slug, owner: 'preview' }).select('name owner');
        if (board) {
            response.status(200).json(board);
        }
        else {
            response.sendStatus(404);
        }
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}

export const getPreviewEditBoard = async (request: Request, response: Response, next: NextFunction) => {

    const { slug } = request.params;

    try {
        const board = await Board.findOne({ slugified: slug }).select('name owner slugified').populate({ path: 'columns', model: Column, select: 'name boardId' });
        if (board) {
            response.status(200).json(board);
        }
        else {
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
        if (board) {
            const columns = await Column.find({ boardId: board._id });
            const ids = columns.map(column => column._id.toHexString());
            await Column.deleteMany({ boardId: board._id });
            await Task.deleteMany({ status: { $in: ids } });
            response.sendStatus(204);
        }
        else {
            response.sendStatus(404);
        }
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}

export const updatePreviewBoard = async (request: Request, response: Response, next: NextFunction) => {
    
    const { id } = request.params;
    const { name, columns } = request.body;

    try {

        const board = await Board.findByIdAndUpdate(id, { name, slugified: slugify(name, {strict: true, lower: true}) }, {new: true});
        if(!board){
            response.sendStatus(404);
        }
        const currentIds = [];

        for (let i = 0; i < columns.length; i++) {
            if(columns[i]?._id){
                const getColumn = await Column.findById(columns[i]._id);
                if(getColumn?.boardId.toString() === id){
                    const column = await Column.findByIdAndUpdate(columns[i]._id, {name: columns[i].name});
                    currentIds.push(column?._id.toHexString());
                }
            }
            else{
                const column = await Column.create({name: columns[i].name, boardId: board?._id, color: getRandomColor()});
                currentIds.push(column?._id.toHexString());
            }
        }
        const savedColumns = await Column.find({boardId: board?._id});
        
        for(let i = 0; i < savedColumns.length; i++){
            if(!currentIds.some(currentId => currentId === savedColumns[i]._id.toHexString())){
                await Column.findByIdAndDelete(savedColumns[i]._id);
            }
        }

        response.status(200).json(board?.slugified);
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}

export const getPreviewTask = async (request: Request, response: Response, next: NextFunction) => {
    
    const { id } = request.params;

    try {
        const task = await Task.findById(id).select('title description status subtasks');
        if(task){
            response.status(200).json(task);
        }
        else{
            response.status(404).json(`Task with an id of ${id} is not found.`);
        }
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}

export const patchPreviewTask = async (request: Request, response: Response, next: NextFunction) => {
    
    const { id } = request.params;

    try {
        const task = await Task.findByIdAndUpdate(id, request.body);
        response.sendStatus(200);
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}

export const deletePreviewTask = async (request: Request, response: Response, next: NextFunction) => {
    
    const { id } = request.params;

    try {
        const task = await Task.findByIdAndDelete(id);
        if(task){
            response.sendStatus(200);
        }
        else{
            response.send(404).json(`Task with id ${id} does not exist.`);
        }
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}

export const postPreviewTask = async (request: Request, response: Response, next: NextFunction) => {
    
    const { body } = request;

    try {
        const task = await Task.create(body);
        if(task){
            response.sendStatus(201);
        }
        else{
            response.sendStatus(400);
        }
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}