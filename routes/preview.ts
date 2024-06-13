import { Router } from 'express';
import { deletePreviewBoard, getFirstPreviewBoardName, getPreviewBoard, getPreviewBoardNames, getPreviewColumns, getPreviewEditBoard, postPreviewBoard, updatePreviewBoard } from '../controllers/preview';

export const previewRoute = Router();

previewRoute.get('/', getFirstPreviewBoardName);

previewRoute.get('/boards', getPreviewBoardNames);

previewRoute.get('/columns/:slug', getPreviewColumns);

previewRoute.post('/board', postPreviewBoard);

previewRoute.get('/board/:slug', getPreviewBoard);

previewRoute.get('/board/edit/:slug', getPreviewEditBoard);

previewRoute.patch('/board/edit/:id', updatePreviewBoard);

previewRoute.delete('/board/:id', deletePreviewBoard);