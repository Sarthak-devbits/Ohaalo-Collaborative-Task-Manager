import { IGetBoardsData, IGetListData } from "@/interfaces/IParams";
import axiosInstances from "../axios";
import { moveCardData } from "@/components/board/KanbanBoard";

export const loginApi = async (data: { email: string; password: string }) => {
  const response = await axiosInstances.instance.post(`/auth/login`, data);
  return response;
};

export const createBoard = async (data: {
  title: string;
  visibility: string;
  backgroundImg: string;
  workspaceId: number;
}) => {
  const response = await axiosInstances.instance.post(`/board`, data);
  return response;
};

export const createList = async (data: {
  listName: string;
  boardId: number;
}) => {
  const response = await axiosInstances.instance.post(`/list`, data);
  return response;
};

export const createCard = async (data: {
  cardTitle: string;
  listId: number;
}) => {
  const response = await axiosInstances.instance.post(`/card`, data);
  return response;
};

export const createWorkspace = async (data: { name: string }) => {
  const response = await axiosInstances.instance.post(`/workspace`, data);
  return response;
};

export const getWorkspaces = async () => {
  const response = await axiosInstances.instance.get(`/workspace`);
  return response?.data?.data;
};

export const getBoards = async (params: IGetBoardsData) => {
  const response = await axiosInstances.instance.get(`/board`, {
    params,
  });
  return response?.data?.data;
};

export const recentlyViewedBoards = async () => {
  const response = await axiosInstances.instance.get(`/board/recently-viewed`);
  return response?.data?.data;
};

export const workspaceDetailedData = async () => {
  const response = await axiosInstances.instance.get(`/workspace/detail`);
  return response?.data?.data;
};

export const getListDetails = async (params: IGetListData) => {
  const response = await axiosInstances.instance.get(`/list`, {
    params,
  });
  return response?.data?.data;
};

export const moveCardApi = async (data: moveCardData) => {
  const response = await axiosInstances.instance.put(`/card/move`, data);
  return response;
};
