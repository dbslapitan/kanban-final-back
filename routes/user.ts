import { Router } from 'express';
import { postUser } from '../controllers/user';

export const userRoute = Router();

userRoute.post('/', postUser);

userRoute.get('/', (req, res) => {
    console.log('got here');
    res.json('reached');
});