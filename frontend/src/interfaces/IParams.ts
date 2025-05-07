export interface IGetBoardsData {
  id?: number;
  search?: string;
  page?: number;
  limit?: number;
  isFiltered?: boolean;
  workspaceId?: number;
}
export interface IGetListData {
  id?: number;
  boardId?: number;
  search?: string;
  page?: number;
  limit?: number;
  isFiltered?: string;
  workspaceId?: number;
}
