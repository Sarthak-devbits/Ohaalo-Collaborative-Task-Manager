import { Request, Response } from 'express';
import { createCardSchema } from '../schemas/card.schema';
import { CardServices } from '../services/card.servies';
import { httpStatusCodes } from '../utils/httpStatusCode';
import { formResponse } from '../utils/formResponse';

const cardServies = new CardServices();

export class CardController {
  async createCard(req: Request, res: Response) {
    const validateData = createCardSchema.parse(req.body);
    const { cardTitle, description, listId } = validateData;

    const createCard = await cardServies.createCard({
      cardTitle: cardTitle,
      description,
      listId: +listId,
      userId: req.id,
    });

    return res
      .status(httpStatusCodes[200].code)
      .json(formResponse(httpStatusCodes[200].code, createCard));
  }
}
