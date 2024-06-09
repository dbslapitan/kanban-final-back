import { Router } from 'express';
import { getFirstPreviewBoardName, getPreviewColumns } from '../controllers/preview';

export const previewRoute = Router();

previewRoute.get('/', getFirstPreviewBoardName);

previewRoute.get('/columns/:id', getPreviewColumns)