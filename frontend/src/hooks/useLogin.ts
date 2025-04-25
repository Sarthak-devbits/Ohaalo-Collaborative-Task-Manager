import { loginApi } from "@/services/webApis/webApis";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginApi,
  });
};
