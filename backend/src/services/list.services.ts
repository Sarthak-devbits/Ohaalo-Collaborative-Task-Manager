import { IListByBoardIdFields } from '@/utils/types';
import { AppError } from '../utils/appError';
import { BoardRole } from '@prisma/client';

export class ListServices {
  async createList(listName: string, boardId: number, userId: number) {
    // Fetch board existence and user access in parallel
    const [boardExist, boardUser] = await Promise.all([
      prisma?.board.findUnique({ where: { id: boardId } }),
      prisma?.boardUser.findUnique({
        where: { boardId_userId: { boardId, userId } },
      }),
    ]);

    if (!boardExist) throw new AppError('Board ID is invalid', 404);
    if (!boardUser)
      throw new AppError(
        `User ${userId} has no access to board ${boardId}`,
        403
      );
    if (boardUser.role === BoardRole.VIEWER)
      throw new AppError('Viewers cannot perform this action', 400);

    // Fetch last position using _max aggregation (better than findFirst)
    const lastPosition = await prisma?.list.aggregate({
      where: { boardId },
      _max: { position: true },
    });

    const newList = await prisma?.list.create({
      data: {
        listName,
        boardId,
        position: (lastPosition?._max.position || 0) + 1,
      },
    });
    return newList;
  }

  async updateList(listName: string, listId: number, userId: number) {
    // Fetch board existence and user access in parallel
    const listExist = await prisma?.list.findUnique({
      where: {
        id: +listId,
      },
    });
    if (!listExist) {
      throw new AppError('ListId is Invalid', 404);
    }
    const boardId = listExist.boardId;

    const [boardUser] = await Promise.all([
      prisma?.boardUser.findUnique({
        where: { boardId_userId: { boardId, userId } },
      }),
    ]);

    if (!boardUser)
      throw new AppError(`User ${userId} has no access to board`, 403);

    if (boardUser.role === BoardRole.VIEWER)
      throw new AppError('Viewers cannot perform this action', 400);

    // Update the list

    const updatedList = await prisma?.list.update({
      where: {
        id: +listId,
      },
      data: {
        listName: listName,
      },
    });

    return updatedList;
  }

  async getLists(queryFields: IListByBoardIdFields) {
    const {
      boardId,
      isFiltered,
      limit = 10,
      page = 0,
      search,
      id,
    } = queryFields;
    const filters: any = {};

    const skipRecords = isFiltered ? 0 : page ? page * limit : 0;
    const takeRecords = isFiltered ? undefined : limit ? limit : 10;

    if (boardId) {
      filters.boardId = boardId;
    }
    if (id) {
      filters.id = id;
    }

    if (search) {
      filters.OR = [
        {
          title: {
            contains: search as string,
            mode: 'insensitive',
          },
        },
      ];
    }

    const listFilteredResponse = await prisma?.list.findMany({
      where: filters,
      orderBy: [
        {
          updatedAt: 'desc',
        },
        {
          id: 'desc',
        },
      ],
      skip: skipRecords,
      take: takeRecords,
    });

    return listFilteredResponse;
  }
  
}
