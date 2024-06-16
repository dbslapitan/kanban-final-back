import { NextFunction, Request, Response } from "express";
import { User } from "../schemas/user";

export const postUser = async (request: Request, response: Response, next: NextFunction) => {

    try {
        const user = await User.findOne({email: request.body.email}).select('email username'); 
        if(user){
            response.status(200).json(user);
        }
        else{
            const createdUser = await User.create(request.body);
            if(createdUser){
                response.status(201).json(createdUser);
            }
            else{
                response.sendStatus(400);
            }
        }
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}

export const getUser = async (request: Request, response: Response, next: NextFunction) => {

    try {
        const user = await User.findById(request.params.id).select('username email');
        if(user){
            response.status(200).json(user);
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

export const patchUser = async (request: Request, response: Response, next: NextFunction) => {

    try {
        const findUser = User.findByIdAndUpdate(request.params.id, request.body);
        response.sendStatus(200);
    }
    catch (e) {
        console.log(e);
        response.status(500).json(e);
    }
}