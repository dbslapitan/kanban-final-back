import { Schema, model } from "mongoose";
import { IColumn } from "./column";

export interface IBoard{
    name: string,
    owner: string,
    editors: string[],
    columns?: IColumn[]
}

const boardSchema = new Schema<IBoard>({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    editors: [{
        type: String,
        required: true
    }]
}, { timestamps: true });

export const Board = model('Board', boardSchema);