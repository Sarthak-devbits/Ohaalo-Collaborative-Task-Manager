import { IListByBoardIdFields } from '../utils/types';

export class LabelService {
  async getLabel(queryFields: IListByBoardIdFields) {
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

    const labelFilteredData = await prisma?.label.findMany({
      where: filters,
      skip: skipRecords,
      take: takeRecords,
    });

    return labelFilteredData;
  }
}
