import axiosInstances from "../axios";

export const loginApi = async (data: { email: string; password: string }) => {
  const response = await axiosInstances.instance.post(`/auth/login`, data);
  return response;
};

export const createBoard = async (data: {
  title: string;
  visibility: string;
  backgroundImg: string;
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
  return response;
};
