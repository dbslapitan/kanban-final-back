import { Router } from 'express';
import { deleteBoard, deleteTask, getBoard, getBoardNames, getColumns, getColumnsMin, getEditBoard, getEditors, getFirstBoardName, getTask, patchBoard, patchBoardEditors, patchTask, postBoard, postTask } from '../controllers/auth';
import { auth } from 'express-oauth2-jwt-bearer';
import { isOwnerBoardId, isOwnerBoardSlug } from '../controllers/middlewares/isOwnerBoard';
import { isEditorBoardSlug } from '../controllers/middlewares/isEditorBoard';
import { isEditorTask, isEditorTaskId } from '../controllers/middlewares/isEditorTask';

const checkJwt = auth({
    audience: process.env.AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL
});

export const authRoute = Router();

authRoute.get('/:username', checkJwt, isOwnerBoardSlug, getFirstBoardName);

authRoute.post('/:username/board', checkJwt, isOwnerBoardSlug, postBoard);

authRoute.get('/:username/boards', checkJwt, getBoardNames);

authRoute.get('/:username/board/editors/:slug', checkJwt, isOwnerBoardSlug, getEditors);

authRoute.get('/:username/columns/:slug', checkJwt, isEditorBoardSlug, getColumns);

authRoute.patch('/:username/board/edit/:id', checkJwt, isOwnerBoardId, patchBoard);

authRoute.delete('/:username/board/:id', checkJwt, isOwnerBoardId, deleteBoard);

authRoute.get('/:username/board/:slug', checkJwt, isEditorBoardSlug, getBoard);

authRoute.get('/:username/columns/min/:slug', checkJwt, isEditorBoardSlug, getColumnsMin);

authRoute.post('/:username/task', checkJwt, isEditorTask, postTask);

authRoute.get('/:username/task/:id', checkJwt, isEditorTaskId, getTask);

authRoute.patch('/:username/task/:id', checkJwt, isEditorTaskId, patchTask);

authRoute.delete('/:username/task/:id', checkJwt, isEditorTaskId, deleteTask);

authRoute.get('/:username/board/edit/:slug', checkJwt, isOwnerBoardSlug, getEditBoard);

authRoute.patch('/:username/board/editors/:slug', checkJwt, isOwnerBoardSlug, patchBoardEditors);