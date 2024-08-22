import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../pages/Home/Home/Home";
import Login from "../Components/Login/Login";
import SignUp from "../Components/SingUp/SignUp";
import PublicCollectionsPage from "../Components/PublicCollectionsPage";
import ItemDetails from "../Components/ItemDetails";
import YourCollectionsPage from "../Components/YourCollectionsPage";
import CollectionDetails from "../Components/CollectionDetails";
import PrivateRoute from "./PrivateRoute";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/public-collections",
        element: <PublicCollectionsPage />,
      },
      {
        path: "/items/:id", // Route for viewing specific item details
        element: <ItemDetails />,
      },

      {
        path: "/collections",
        element: (
          <PrivateRoute>
            <YourCollectionsPage />
          </PrivateRoute>
        ), // Route for the user's collections
      },
      {
        path: "/collections/:id",
        element: <CollectionDetails />, // Route for viewing collection details
      },
    ],
  },
]);
