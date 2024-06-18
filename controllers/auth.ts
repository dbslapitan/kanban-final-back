import { NextFunction, Request, Response } from "express";
import { User } from "../schemas/user";
import { Board } from "../schemas/board";
import slugify from "slugify";
import getRandomColor from "../libs/randomColor";
import { Column } from "../schemas/column";
import { Task } from "../schemas/task";

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
        const { _id } = await Board.create({ name, owner: username, editors: [], slugified });
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

export const getColumns = async (request: Request, response: Response, next: NextFunction) => {

    const { slug } = request.params;        
    const {username} = request.params;

    try {
        const board = await Board.findOne({ slugified: slug, owner: username }).populate({ path: 'columns', model: Column, populate: { path: 'tasks', model: Task, select: 'title description status subtasks' }, select: 'name boardId color' });
        response.status(200).json(board?.columns);
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}

export const patchBoard = async (request: Request, response: Response, next: NextFunction) => {
    
    const { id } = request.params;
    const { name, columns } = request.body;

    try {

        const board = await Board.findByIdAndUpdate(id, { name, slugified: slugify(name, {strict: true, lower: true}) }, {new: true});

        for (let i = 0; i < columns.length; i++) {
            if(columns[i]?._id){
                const column = await Column.findByIdAndUpdate(columns[i]._id, {name: columns[i].name});
            }
            else{
                const column = await Column.create({name: columns[i].name, boardId: board?._id, color: getRandomColor()});
            }
        }

        response.status(200).json(board?.slugified);
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}

export const deleteBoard = async (request: Request, response: Response, next: NextFunction) => {

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

export const getBoard = async (request: Request, response: Response, next: NextFunction) => {

    const { slug, username } = request.params;

    try {
        const board = await Board.findOne({ slugified: slug, owner: username }).select('name owner');
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

export const getColumnsMin = async (request: Request, response: Response, next: NextFunction) => {

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

export const postTask = async (request: Request, response: Response, next: NextFunction) => {
    
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

export const getTask = async (request: Request, response: Response, next: NextFunction) => {
    
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

export const patchTask = async (request: Request, response: Response, next: NextFunction) => {
    
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

export const deleteTask = async (request: Request, response: Response, next: NextFunction) => {
    
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

export const getEditBoard = async (request: Request, response: Response, next: NextFunction) => {

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