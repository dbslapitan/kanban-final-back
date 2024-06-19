import { Router } from 'express';
import { getUser, getUsers, patchUser, postUser } from '../controllers/user';
import { auth } from 'express-oauth2-jwt-bearer';

const checkJwt = auth({
    audience: process.env.AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL
});

export const userRoute = Router();

userRoute.post('/', postUser);

userRoute.patch(`/:id`, patchUser);

userRoute.get('/:id', getUser);

userRoute.get('/search/:keyword', checkJwt, getUsers);