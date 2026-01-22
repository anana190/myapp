import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Layout from "../components/Layout/Layout";
import Login from "../pages/Login";
import Favorites from "../pages/Favorites";
import BookDetails from "../components/BookDetails/BookDetails";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "home",
            element: <Home />,
          },
          {
            path: "favorites",
            element: <Favorites />,
          },
          {
            path: "book/:id",
            element: <BookDetails />,
          },
        ],
      },
    ],
  },
]);
