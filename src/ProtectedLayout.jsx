import React from "react";
import { Outlet } from "react-router-dom";
const ProtectedLayout = () => {
  return (
    <div className="protected-layout">
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
