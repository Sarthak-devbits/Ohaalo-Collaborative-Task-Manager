import { useSelector } from "react-redux";
import { RootState } from "./store";

export const useSessionVariables = () => {
  const userId = useSelector((state: RootState) => state?.user?.userId);
  const username = useSelector((state: RootState) => state?.user?.username);
  const email = useSelector((state: RootState) => state?.user?.email);
  const isAuthenticated = useSelector(
    (state: RootState) => state?.user?.isLoggedIn
  );

  return {
    userId,
    username,
    email,
    isAuthenticated,
  };
};
