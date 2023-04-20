import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter, createHashRouter } from "react-router-dom";
import playgroundRouts from "./playground/routes";
import gameRouts from "./game/routes";

// Funny thing is, hash router doesn't work with base url set in router config
// But it works without base, no matter what the actual base is.
// so, we only use BASE_URL to determine if we are running on github pages and use hash router
const createRouter = (import.meta.env.BASE_URL === "/nums/") ? createHashRouter : createBrowserRouter;

const router = createHashRouter([
  {
    path: "/",
    ...gameRouts
  },
  {
    path: "/playground",
    ...playgroundRouts
  }
], { 
  future: {
    v7_normalizeFormMethod: true,
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
