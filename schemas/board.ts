import { Schema, model } from "mongoose";
import { Column, IColumn } from "./column";

export interface IBoard{
    name: string,
    owner: string,
    editors: string[],
    columns?: IColumn[],
    slugified: string
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
    }],
    slugified: {
        type: String,
        required: true
    }
}, 
{ 
    timestamps: true,
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
        
 });

boardSchema.virtual('columns', {
    ref: 'Column',
    localField: '_id',
    foreignField: 'boardId'
})

export const Board = model('Board', boardSchema);