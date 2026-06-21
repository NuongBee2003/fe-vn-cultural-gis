import { useEffect } from "react";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routeConfig } from "@/routes";
import { setupTokenExpirationCheck } from "@/utils/tokenManager";

function renderRoute(route) {
  if (route.children?.length) {
    return (
      <Route key={route.path} path={route.path} element={route.element}>
        {route.children.map((child) =>
          child.index ? (
            <Route key="index" index element={child.element} />
          ) : (
            <Route key={child.path} path={child.path} element={child.element} />
          )
        )}
      </Route>
    );
  }

  return <Route key={route.path} path={route.path} element={route.element} />;
}

export default function App() {
  useEffect(() => {
    // Chủ động kiểm tra thời hạn token và lên lịch tự động đăng xuất
    setupTokenExpirationCheck();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {
          routeConfig.map(renderRoute)
        }
      </Routes>
    </BrowserRouter>
  );
}
