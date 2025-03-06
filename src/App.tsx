import React from "react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { StrictMode } from "react";

const router = createRouter({ routeTree });

const App: React.FC = () => {
  return (
    <>
      <StrictMode>
        <RouterProvider router={router}/>
      </StrictMode>
    </>
  )
}

export default App;