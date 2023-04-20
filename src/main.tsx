import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter, createHashRouter } from "react-router-dom";
import playgroundRouts from "./playground/routes";
import gameRouts from "./game/routes";

const createRouter = import.meta.env.BASE_URL === "/nums/" ? createHashRouter : createBrowserRouter;

const router = createRouter([
  {
    path: "/",
    ...gameRouts
  },
  {
    path: "/playground",
    ...playgroundRouts
  }
], { 
  basename: import.meta.env.BASE_URL,
  future: {
    v7_normalizeFormMethod: true,
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
