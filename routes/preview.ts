import { Router } from 'express';
import { getFirstPreviewBoardName, getPreviewBoardNames, getPreviewColumns } from '../controllers/preview';

export const previewRoute = Router();

previewRoute.get('/', getFirstPreviewBoardName);

previewRoute.get('/boards', getPreviewBoardNames);

previewRoute.get('/columns/:slug', getPreviewColumns);