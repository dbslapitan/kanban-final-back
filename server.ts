import * as dotenv from "dotenv";

const result = dotenv.config();

if(result.error){
    console.log(result.error.message);
}

import * as express from 'express';
import * as cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.listen(8080, () => {
    console.log(`Listening to PORT 8080...`);
});
