import { Router } from 'express';
import { deleteBoard, getBoard, getBoardNames, getColumns, getFirstBoardName, patchBoard, postBoard } from '../controllers/auth';
import { auth } from 'express-oauth2-jwt-bearer';

const checkJwt = auth({
    audience: process.env.AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL
});

export const authRoute = Router();

authRoute.get('/:username', checkJwt, getFirstBoardName);

authRoute.post('/:username/board', checkJwt, postBoard);

authRoute.get('/:username/boards', checkJwt, getBoardNames);

authRoute.get('/:username/columns/:slug', checkJwt, getColumns);

authRoute.patch('/:username/board/edit/:id', checkJwt, patchBoard);

authRoute.delete('/:username/board/:id', checkJwt, deleteBoard);

authRoute.get('/board/:slug', getBoard);