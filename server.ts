import * as dotenv from 'dotenv';

const result = dotenv.config();

if(result.error){
    console.log(result.error.message);
}

import * as express from 'express';
import * as cors from 'cors';
import { normalizePort } from './libs/normalizePort';
import { connect, connection } from 'mongoose';

const app = express();

const URI = process.env.URI;

connect(URI as string);
connection.on('connected', () => console.log('Connected to MongoDB...'));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Backend for Kanban App by Dirk Brandon Lapitan'));

const PORT = normalizePort();

app.listen(PORT, () => {
    console.log(`Listening to PORT ${PORT}...`);
});
