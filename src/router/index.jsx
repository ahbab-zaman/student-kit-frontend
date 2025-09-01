import { createBrowserRouter } from "react-router";
import App from "../App";
import Dashboard from "../layouts/Dashboard";
import Schedule from "../layouts/Schedule";
import Budget from "../layouts/Budget";
import Quiz from "../layouts/Quiz";
import Study from "../layouts/Study";
import Focus from "../layouts/Focus";
import Todo from "../layouts/Todo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/schedule",
        element: <Schedule />,
      },
      {
        path: "/budget",
        element: <Budget />,
      },
      {
        path: "/quiz",
        element: <Quiz />,
      },
      {
        path: "/study",
        element: <Study />,
      },
      {
        path: "/todo",
        element: <Todo />,
      },
      {
        path: "/focus",
        element: <Focus />,
      },
    ],
  },
]);

export default router;
