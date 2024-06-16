import { Router } from 'express';
import { postUser } from '../controllers/user';

export const userRoute = Router();

userRoute.post('/', postUser);

userRoute.patch(`/:id`, );