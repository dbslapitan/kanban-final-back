import { Router } from 'express';
import { deletePreviewBoard, deletePreviewTask, getFirstPreviewBoardName, getPreviewBoard, getPreviewBoardNames, getPreviewColumns, getPreviewColumnsMin, getPreviewEditBoard, getPreviewTask, patchPreviewTask, postPreviewBoard, updatePreviewBoard } from '../controllers/preview';

export const previewRoute = Router();

previewRoute.get('/', getFirstPreviewBoardName);

previewRoute.get('/boards', getPreviewBoardNames);

previewRoute.get('/columns/:slug', getPreviewColumns);

previewRoute.get('/columns/min/:slug', getPreviewColumnsMin);

previewRoute.post('/board', postPreviewBoard);

previewRoute.get('/board/:slug', getPreviewBoard);

previewRoute.get('/board/edit/:slug', getPreviewEditBoard);

previewRoute.patch('/board/edit/:id', updatePreviewBoard);

previewRoute.delete('/board/:id', deletePreviewBoard);

previewRoute.get('/task/:id', getPreviewTask);

previewRoute.patch('/task/:id', patchPreviewTask);

previewRoute.delete('/task/:id', deletePreviewTask);