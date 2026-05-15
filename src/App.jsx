import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routeConfig } from "@/routes";

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
