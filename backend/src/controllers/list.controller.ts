import { listCreateSchema, listUpdateSchema } from '../schemas/list.schema';
import { formResponse } from '../utils/formResponse';
import { httpStatusCodes } from '../utils/httpStatusCode';
import { Response, Request } from 'express';
import { ListServices } from '../services/list.services';
import { AppError } from '../utils/appError';
import { IListByBoardIdFields } from '@/utils/types';

const listService = new ListServices();
export class ListController {
  async createList(req: Request, res: Response) {
    const userId = req.id;
    const { listName, boardId } = listCreateSchema.parse(req.body);
    const result = await listService.createList(listName, boardId, userId);
    return res
      .status(httpStatusCodes[200].code)
      .json(formResponse(httpStatusCodes[200].code, result));
  }
  

  async updateList(req: Request, res: Response) {
    if (!Object.keys(req.body).length) {
      throw new AppError('API Missing body', 412);
    }
    const { listName } = req.body;
    const listId = Number(req.query.id as string);
    const userId = req.id;
    if (!listId) {
      throw new AppError('ListId is required', 400);
    }

    const inputData = {
      listName,
      listId,
    };

    listUpdateSchema.parse(inputData);

    const result = await listService.updateList(listName, listId, userId);

    return res
      .status(httpStatusCodes[200].code)
      .json(formResponse(httpStatusCodes[200].code, result));
  }

  async deleteList(req: Request, res: Response) {
    const id = Number(req.query.id);
    const userId = Number(req.id);

    if (!id) throw new AppError('List ID is required', 400);

    // Fetch list and user validity in parallel
    const [listExist, validUser] = await Promise.all([
      prisma?.list.findUnique({ where: { id } }),
      prisma?.boardUser.findUnique({
        where: { boardId_userId: { boardId: id, userId } },
      }),
    ]);

    if (!listExist) throw new AppError('Invalid List ID', 404);
    if (!validUser)
      throw new AppError('User is not authorized to delete this list', 403);

    await prisma?.list.delete({ where: { id } });

    return res
      .status(httpStatusCodes[200].code)
      .json(formResponse(httpStatusCodes[200].code, 'Deleted Successfully'));
  }

  async getLists(req: Request, res: Response) {
    const { search, page, limit, boardId, isFiltered, id } = req.query;

    if (boardId) {
      const boardExist = await prisma?.board.findUnique({
        where: {
          id: +boardId,
        },
      });
      if (!boardExist) {
        throw new AppError('BoardId is Invalid', 404);
      }
    }

    const queryFields: IListByBoardIdFields = {
      id: id ? +id : undefined,
      boardId: boardId ? +boardId : undefined,
      search: search as string,
      page: page ? +page : 0,
      limit: limit ? +limit : 10,
      isFiltered: isFiltered as string,
    };

    const listDataResponse = await listService.getLists(queryFields);

    return res
      .status(httpStatusCodes[200].code)
      .json(formResponse(httpStatusCodes[200].code, listDataResponse));
  }
}
