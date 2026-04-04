import React from "react";
import { Route, Routes, useLocation } from "@/tools/router";
import routerApp from "@/config/router";
import NotFound from "@/pages/NotFound";

const Router: React.FC = () => {
  const location = useLocation();
  return (
    <Routes location={location}>
      {routerApp().map(({ path, element }) => {
        return <Route key={path} path={path} element={element} />;
      })}



      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
