import * as dotenv from 'dotenv';

const result = dotenv.config();

if(result.error){
    console.log(result.error.message);
}

import * as express from 'express';
import * as cors from 'cors';
import { normalizePort } from './libs/normalizePort';
import { connect, connection } from 'mongoose';
import { previewRoute } from './routes/preview';
import { userRoute } from './routes/user';
import { authRoute } from './routes/auth';

const app = express();

const URI = process.env.URI;

connect(URI as string);
connection.on('connected', () => console.log('Connected to MongoDB...'));

app.use(cors({
  origin: "https://kanban.dblapitan.dev/",   // or your frontend origin
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options('*', cors());

app.use(express.json());

app.get('/', (req, res) => res.send('Backend for Kanban App by Dirk Brandon Lapitan'));

app.use('/api/v1/preview' ,previewRoute);

app.use('/api/v1/username', userRoute);

app.use('/api/v1', authRoute);

const PORT = normalizePort();

app.listen(PORT, () => {
    console.log(`Listening to PORT ${PORT}...`);
});
