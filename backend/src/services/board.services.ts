import { IQueryFields } from '../utils/types';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/appError';
import { z } from 'zod';
import { boardUpdateSchema } from '../schemas/board.schema';
import { IEditBoard } from '@/utils/types/board.types';

export class BoardServices {
  async getBoards(queryFields: IQueryFields) {
    const { id, isFiltered, limit = 10, page = 0, search } = queryFields;
    const filters: any = {};

    const skipRecords = isFiltered ? 0 : page ? page * limit : 0;
    const takeRecords = isFiltered ? undefined : limit ? limit : 10;

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

    const baordsResult = await prisma?.board.findMany({
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

    return isFiltered
      ? baordsResult?.map((item) => {
          return {
            id: item.id,
            name: item.title,
            value: item.id,
          };
        })
      : baordsResult;
  }

  async updateBoard(boardId: string, userId: number, inputData: IEditBoard) {
    const existingBoard = await prisma.board.findUnique({
      where: { id: +boardId, ownerId: +userId },
    });

    if (!existingBoard) {
      throw new AppError('Board not found or unauthorized', 403);
    }

    const updatedBoard = await prisma.board.update({
      where: {
        id: +boardId,
      },
      data: inputData,
    });

    return updatedBoard;
  }
  
}
