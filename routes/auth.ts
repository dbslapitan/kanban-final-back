import { Router } from 'express';
import { getFirstBoardName } from '../controllers/auth';

export const authRoute = Router();

authRoute.get('/:username', getFirstBoardName);