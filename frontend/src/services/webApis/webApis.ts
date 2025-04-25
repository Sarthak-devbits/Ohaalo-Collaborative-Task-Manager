import axiosInstances from "../axios";

export const loginApi = async (data: { email: string; password: string }) => {
  const response = await axiosInstances.instance.post(`/auth/login`, data);
  return response;
};
