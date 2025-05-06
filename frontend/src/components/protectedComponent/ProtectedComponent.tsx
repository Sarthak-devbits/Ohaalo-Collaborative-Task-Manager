import { useSessionVariables } from "@/redux/useSessionVariables";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedComponent = ({ children }) => {
  const { isAuthenticated } = useSessionVariables();
  const navigate = useNavigate();

  console.log(isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  }
  return <div>{children}</div>;
};

export default ProtectedComponent;
