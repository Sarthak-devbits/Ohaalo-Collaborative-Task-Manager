import { AppError } from '../utils/appError';
import { labelCreateSchema, labelUpdateSchema } from '../schemas/label.schema';
import { isBoardExist } from '../utils/board.utils';
import { Request, Response } from 'express';
import { httpStatusCodes } from '../utils/httpStatusCode';
import { formResponse } from '../utils/formResponse';
import { BoardRole } from '@prisma/client';
import { z } from 'zod';
import { isListExist } from '../utils/list.utils';
import { IListByBoardIdFields } from '@/utils/types';
import { LabelService } from '../services/label.services';

const labelServices = new LabelService();

export class LabelController {
  async createLabel(req: Request, res: Response) {
    const validateData = labelCreateSchema.parse(req.body);
    const { labelName, color, boardId } = validateData;

    if (!boardId) {
      throw new AppError(`BoardId is required`, 404);
    }

    const [board, isBoardMember] = await Promise.all([
      isBoardExist(boardId),
      prisma?.boardUser.findFirst({
        where: {
          boardId,
          userId: req.id,
        },
      }),
    ]);
    console.log(isBoardMember)
    if (!board) {
      throw new AppError(`BoardId is Invalid`, 400);
    }
    if (!isBoardMember || isBoardMember.role === BoardRole.VIEWER) {
      throw new AppError(`User don't have access`, 400);
    }

    const createLabel = await prisma?.label.create({
      data: {
        labelName,
        color,
        boardId: +boardId,
      },
    });

    return res
      .status(httpStatusCodes[200].code)
      .json(formResponse(httpStatusCodes[200].code, createLabel));
  }

  async editLabel(req: Request, res: Response) {
    const { labelName, color, boardId, id } = req.body;

    if (!Object.keys(req.body).length) {
      throw new AppError('API Missing body', 412);
    }

    if (!id) {
      throw new AppError(`LabelId is required`, 404);
    }

    if (!boardId) {
      throw new AppError(`BoardId is required`, 404);
    }

    const inputData: z.infer<typeof labelUpdateSchema> = {
      labelName,
      color,
      boardId,
      id,
    };

    labelUpdateSchema.parse(inputData);
    const [board, list] = await Promise.all([
      isBoardExist(boardId),
      isListExist(id),
    ]);

    if (!board) {
      throw new AppError(`BoardId is Invalid`, 400);
    }

    if (!list) {
      throw new AppError(`ListId is Invalid`, 400);
    }

    const isBoardMember = await prisma?.boardUser.findFirst({
      where: {
        boardId,
        userId: req.id,
      },
    });

    if (!isBoardMember || isBoardMember.role === BoardRole.VIEWER) {
      throw new AppError(`User don't have access`, 400);
    }

    const updateLabel = await prisma?.label.update({
      where: {
        id: +id,
      },
      data: inputData,
    });

    return res
      .status(httpStatusCodes[200].code)
      .json(formResponse(httpStatusCodes[200].code, updateLabel));
  }

  async getLabelByBoardId(req: Request, res: Response) {
    const { search, page, limit, boardId, isFiltered, id } = req.body;

    if (!id) {
      throw new AppError(`LabelId is required`, 400);
    }
    if (!boardId) {
      throw new AppError(`boardId is required`, 400);
    }

    const queryFields: IListByBoardIdFields = {
      id: id ? +id : undefined,
      boardId: boardId ? +boardId : undefined,
      search: search as string,
      page: page ? +page : 0,
      limit: limit ? +limit : 10,
      isFiltered: isFiltered as string,
    };

    const labelData = await labelServices.getLabel(queryFields);

    return res
      .status(httpStatusCodes[200].code)
      .json(formResponse(httpStatusCodes[200].code, labelData));
  }

  async deleteLabelById(req: Request, res: Response) {
    const { id } = req.query;
    const userId = req.id;

    if (!id) {
      throw new AppError(`LabelId is required`, 400);
    }
    const list = await isListExist(Number(id));
    if (!list) {
      throw new AppError('ListId is Invalid', 400);
    }
    const listBoardId = list.boardId;
    const userBoard = await prisma?.boardUser.findFirst({
      where: {
        boardId: +listBoardId,
        userId: +userId,
      },
    });
    if (!userBoard || userBoard.role === BoardRole.VIEWER) {
      throw new AppError(`User don't have delete permision`, 400);
    }

    await prisma?.list.delete({
      where: {
        id: +id,
      },
    });

    return res
      .status(httpStatusCodes[200].code)
      .json(
        formResponse(httpStatusCodes[200].code, 'Label Deleted Successfully')
      );
  }
}
