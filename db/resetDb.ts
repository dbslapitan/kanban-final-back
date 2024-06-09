import * as dotenv from "dotenv";
import { connect, connection, disconnect } from "mongoose";
import { boards } from "./data";
import { Board } from "../schemas/board";
import { Column } from "../schemas/column";
import { Task } from "../schemas/task";
import getRandomColor from "../libs/randomColor";
dotenv.config();

const URI = process.env.URI;

(async () => {

    console.log('Connecting to MongoDB...');
    await connect(URI as string);
    console.log('Connected to MongoDB..');

    console.log('Dropping collections...');
    connection.dropCollection('boards');
    connection.dropCollection('columns');
    connection.dropCollection('tasks');
    connection.dropCollection('subtasks');
    console.log('Collections dropped...');

    console.log('Populating boards...');
    for(let i = 0; i < boards.length; i++){
        console.log(`Adding board ${boards[i].name}...`);
        const { _id: boardId } = await Board.create({
            name: boards[i].name,
            owner: "preview",
            editors: []
        });

        for(let j = 0; j < boards[i].columns.length; j++){
            const { _id: columnId } = await Column.create({
                name: boards[i].columns[j].name,
                boardId: boardId,
                color: getRandomColor()
            });

            for(let k = 0; k < boards[i].columns[j].tasks.length; k++){
                const task = new Task({
                    title: boards[i].columns[j].tasks[k].title,
                    description: boards[i].columns[j].tasks[k].description,
                    status: columnId,
                    subtasks: boards[i].columns[j].tasks[k].subtasks
                });
                await task.save();
            }
        }
    }
    console.log('Population completed...');
    disconnect();
    console.log('Connection closed...');
})();