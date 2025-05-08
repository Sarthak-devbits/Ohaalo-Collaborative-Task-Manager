import { Request, Response } from 'express';
import {
  addMemberScema,
  createCardSchema,
  moveCardSchema,
} from '../schemas/card.schema';
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

  async addCardMember(req: Request, res: Response) {
    const validateData = addMemberScema.parse(req.body);
    const { cardId, userIds } = validateData;

    const cardExist = await prisma?.card.findFirst({
      where: {
        id: +cardId,
      },
    });

    if (!cardExist) {
      return res
        .status(httpStatusCodes[404].code)
        .json(formResponse(httpStatusCodes[404].code, 'Invalid Card ID'));
    }

    const board = await prisma?.board.findFirst({
      where: {
        lists: {
          some: {
            cards: {
              some: {
                id: +cardId,
              },
            },
          },
        },
      },
    });

    const boardMembers = await prisma?.boardUser.findMany({
      where: {
        boardId: board?.id,
      },
      select: {
        userId: true,
      },
    });

    const userIdsInBoard = boardMembers?.map((member) => member.userId);

    const isValidUsers =
      userIds.filter((userId) => !userIdsInBoard?.includes(userId)).length > 0
        ? false
        : true;

    if (!isValidUsers) {
      return res
        .status(httpStatusCodes[400].code)
        .json(
          formResponse(
            httpStatusCodes[400].code,
            `Some User IDs are not members of the Card`
          )
        );
    }

    return res
      .status(httpStatusCodes[200].code)
      .json(formResponse(httpStatusCodes[200].code,  'Members added to Card successfully'));
  }

}
