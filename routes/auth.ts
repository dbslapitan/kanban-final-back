import { Router } from 'express';
import { deleteBoard, deleteTask, getBoard, getBoardNames, getColumns, getColumnsMin, getEditBoard, getEditors, getFirstBoardName, getTask, patchBoard, patchTask, postBoard, postTask } from '../controllers/auth';
import { auth } from 'express-oauth2-jwt-bearer';
import { isOwnerBoard } from '../controllers/middlewares/isOwnerBoard';

const checkJwt = auth({
    audience: process.env.AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL
});

export const authRoute = Router();

authRoute.get('/:username', checkJwt, isOwnerBoard, getFirstBoardName);

authRoute.post('/:username/board', checkJwt, isOwnerBoard, postBoard);

authRoute.get('/:username/boards', checkJwt, isOwnerBoard, getBoardNames);

authRoute.get('/:username/board/editors/:slug', checkJwt, getEditors);

authRoute.get('/:username/columns/:slug', checkJwt, getColumns);

authRoute.patch('/:username/board/edit/:id', checkJwt, patchBoard);

authRoute.delete('/:username/board/:id', checkJwt, deleteBoard);

authRoute.get('/:username/board/:slug', checkJwt, getBoard);

authRoute.get('/:username/columns/min/:slug', checkJwt, getColumnsMin);

authRoute.post('/:username/task', checkJwt, postTask);

authRoute.get('/:username/task/:id', checkJwt, getTask);

authRoute.patch('/:username/task/:id', checkJwt, patchTask);

authRoute.delete('/:username/task/:id', checkJwt, deleteTask);

authRoute.get('/:username/board/edit/:slug', checkJwt, getEditBoard);