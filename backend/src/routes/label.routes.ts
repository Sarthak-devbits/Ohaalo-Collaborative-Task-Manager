import { LabelController } from '../controllers/label.controller';
import { Router } from 'express';

export const labelRoutes = Router();

const labelController = new LabelController();

labelRoutes.post('/label', labelController.createLabel);
labelRoutes.put('/label', labelController.editLabel);
labelRoutes.get('/label', labelController.getLabelByBoardId);
labelRoutes.delete('/label',labelController.deleteLabelById);

