import { GptController } from '../controllers/gpt.controller';
import { Router } from 'express';

export const gptRoutes = Router();
const gptControllerInstance = new GptController();

gptRoutes.post('/gpt', gptControllerInstance.getGeminiData);
