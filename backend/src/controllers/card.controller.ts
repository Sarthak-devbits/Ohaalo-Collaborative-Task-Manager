import { Request, Response } from 'express';
import { createCardSchema, moveCardSchema } from '../schemas/card.schema';
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

  async moveCard(req: Request, res: Response) {
    const validateData = moveCardSchema.parse(req.body);
    const { sourceListId, destinationListId, cardId } = validateData;

    const cardExist = await prisma?.card.findFirst({
      where: {
        id: +cardId,
        listId: {
          in: [sourceListId, destinationListId],
        },
      },
    });

    if (!cardExist) {
      return res
        .status(httpStatusCodes[404].code)
        .json(formResponse(httpStatusCodes[404].code, 'Invalid Card ID'));
    }

    const listExistInSameBoard = await prisma?.board.findFirst({
      where: {
        lists: {
          some: {
            id: {
              in: [sourceListId, destinationListId],
            },
          },
        },
      },
    });

    if (!listExistInSameBoard) {
      return res
        .status(httpStatusCodes[404].code)
        .json(formResponse(httpStatusCodes[404].code, 'Invalid List ID'));
    }

    const moveCard = await cardServies.moveCard({
      sourceListId: +sourceListId,
      destinationListId: +destinationListId,
      cardId: +cardId,
      userId: req.id,
    });

    if (!moveCard) {
      return res
        .status(httpStatusCodes[404].code)
        .json(
          formResponse(httpStatusCodes[404].code, 'Unable to move the card')
        );
    }

    return res
      .status(httpStatusCodes[200].code)
      .json(formResponse(httpStatusCodes[200].code, moveCard));
  }
}
