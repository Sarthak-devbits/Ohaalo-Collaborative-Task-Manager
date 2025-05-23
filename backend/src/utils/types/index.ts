export interface IListByBoardIdFields {
  id?: number;
  boardId?: number;
  search?: string;
  page?: number;
  limit?: number;
  isFiltered?: string;
  workspaceId?:number
}

export type IQueryFields = Omit<IListByBoardIdFields, "boardId">;
