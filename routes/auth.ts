import { Router } from 'express';
import { getFirstBoardName } from '../controllers/auth';
import { auth } from 'express-oauth2-jwt-bearer';

const checkJwt = auth({
    audience: process.env.AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL
});

export const authRoute = Router();

authRoute.get('/:username', checkJwt, getFirstBoardName);