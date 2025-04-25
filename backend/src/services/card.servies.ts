import { AppError } from '@/utils/appError';
import { isListExist } from '@/utils/list.utils';
import { BoardRole } from '@prisma/client';

export class CardServices {
  async createCard({
    cardTitle,
    description,
    listId,
    userId,
  }: {
    cardTitle: string;
    description?: string;
    listId: number;
    userId: number;
  }) {
    if (!listId) {
      throw new AppError(`ListId is required`, 404);
    }

    const [list] = await Promise.all([isListExist(listId)]);

    const isBoardMember = await prisma?.boardUser.findFirst({
      where: {
        boardId: list?.boardId,
        userId,
      },
    });

    if (!list) {
      throw new AppError(`ListId is Invalid`, 400);
    }
    if (!isBoardMember || isBoardMember.role === BoardRole.VIEWER) {
      throw new AppError(`User don't have access`, 400);
    }

    const card = await prisma?.card.create({
      data: {
        cardTitle: cardTitle,
        bannerImg: '',
        completed: false,
        description: description || '',
        listId: +listId,
      },
    });
    return card;
  }

  async getCard(cardId: number) {
    // Simulate fetching a card by ID
    const card = {
      id: cardId,
      cardTitle: 'Sample Card',
      description: 'This is a sample card description',
      listId: 1,
    };
    return card;
  }
}
