import { Router } from 'express';
import { getUser, patchUser, postUser } from '../controllers/user';

export const userRoute = Router();

userRoute.post('/', postUser);

userRoute.patch(`/:id`, patchUser);

userRoute.get('/:id', getUser);