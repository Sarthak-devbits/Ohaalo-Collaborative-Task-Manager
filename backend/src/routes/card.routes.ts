import { CardController } from '../controllers/card.controller';
import { verifyToken } from '../middleware/user.middleware';
import { Router } from 'express';

export const cardRoutes = Router();
const cardController = new CardController();

cardRoutes.post('/card', verifyToken, cardController.createCard);
cardRoutes.post('/card/member/add', verifyToken, cardController.addCardMember);
cardRoutes.put('/card/move', verifyToken, cardController.moveCard);



// cardRoutes.post('/gpt', gptControllerInstance.getGeminiData);
