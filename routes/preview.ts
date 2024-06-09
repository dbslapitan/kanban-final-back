import { Router } from 'express';
import { getFirstPreviewBoardName } from '../controllers/preview';

export const previewRoute = Router();

previewRoute.get('/', getFirstPreviewBoardName);