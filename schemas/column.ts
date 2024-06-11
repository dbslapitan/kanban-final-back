import { Schema, SchemaTypes, model } from "mongoose";
import { Board, IBoard } from "./board";

export interface IColumn{
    name: string,
    boardId: string | IBoard,
    color: string
}

const columnSchema = new Schema<IColumn>({
    name: {
        type: String,
        required: true
    },
    boardId: {
        type: SchemaTypes.ObjectId,
        ref: Board,
        required: true
    },
    color: {
        type: String,
        required: true
    },
}, 
{ 
    timestamps: true,
    toObject: {virtuals: true},
    toJSON: {virtuals: true},
    id: false
});

columnSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'status'
});

export const Column = model('Column', columnSchema);