import { verifyToken } from '../middleware/user.middleware';
import { ListController } from '../controllers/list.controller';
import { Router } from 'express';

export const listRoutes = Router();
const listController = new ListController();

listRoutes.get('/list',verifyToken,listController.getLists)

listRoutes.post('/list',verifyToken,listController.createList);

listRoutes.put('/list',verifyToken,listController.updateList);

listRoutes.delete('/list',verifyToken,listController.deleteList)