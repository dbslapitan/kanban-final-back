import mongoose, { Schema, SchemaTypes, model } from "mongoose";
import { Column, IColumn } from "./column";

export interface ITask{
    title: string,
    description: string | '',
    status: IColumn | string,
    subtasks: ISubtask[]
}

export interface ISubtask{
    title: string,
    isCompleted: boolean,
    taskId: ITask | string
}

export const subtaskSchema = new Schema<ISubtask>({
    title: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        required: true
    }
});

Schema.Types.String.checkRequired(v => v != null);

const taskSchema = new Schema<ITask>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: SchemaTypes.ObjectId,
        ref: Column,
        required: true
    },
    subtasks: [subtaskSchema]
}, { timestamps: true });

export const Task = model('Task', taskSchema);