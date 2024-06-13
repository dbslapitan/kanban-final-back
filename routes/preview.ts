import { Router } from 'express';
import { deletePreviewBoard, getFirstPreviewBoardName, getPreviewBoard, getPreviewBoardNames, getPreviewColumns, postPreviewBoard } from '../controllers/preview';

export const previewRoute = Router();

previewRoute.get('/', getFirstPreviewBoardName);

previewRoute.get('/boards', getPreviewBoardNames);

previewRoute.get('/columns/:slug', getPreviewColumns);

previewRoute.post('/board', postPreviewBoard);

previewRoute.get('/board/:slug', getPreviewBoard);

previewRoute.delete('/board/:id', deletePreviewBoard);