// import { createBrowserRouter } from "react-router-dom";
// import Main from "../Layout/Main";
// import Home from "../pages/Home/Home/Home";
// import Login from "../Components/Login/Login";
// import SignUp from "../Components/SingUp/SignUp";
// import PublicCollectionsPage from "../Components/PublicCollectionsPage";
// import ItemDetails from "../Components/ItemDetails";
// import YourCollectionsPage from "../Components/YourCollectionsPage";
// import CollectionDetails from "../Components/CollectionDetails";
// import PrivateRoute from "./PrivateRoute";
// import CreateCollection from "../Components/CreateCollection";


// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Main />,
//     children: [
//       {
//         path: "/",
//         element: <Home />,
//       },
//       {
//         path: "/login",
//         element: <Login />,
//       },
//       {
//         path: "/signup",
//         element: <SignUp />,
//       },
//       {
//         path: "/public-collections",
//         element: <PublicCollectionsPage />,
//       },
//       {
//         path: "/items/:id", // Route for viewing specific item details
//         element: <ItemDetails />,
//       },

//       {
//         path: "/collections",
//         element: (
//           <PrivateRoute>
//             <YourCollectionsPage />
//           </PrivateRoute>
//         ), // Route for the user's collections
//       },
//       {
//         path: "/collections/:id",
//         element: <CollectionDetails />, // Route for viewing collection details
//       },
//       {
//         path: "/create-collection",
//         element: (
//           <PrivateRoute>
//             <CreateCollection />
//           </PrivateRoute>
//         ), // Route for creating a new collection
//       },
//     ],
//   },
// ]);
// src/Routes/Routes.jsx
import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../pages/Home/Home/Home";
import Login from "../Components/Login/Login";

import PublicCollectionsPage from "../Components/PublicCollectionsPage";
import ItemDetails from "../Components/ItemDetails";
import YourCollectionsPage from "../Components/YourCollectionsPage";
import CollectionDetails from "../Components/CollectionDetails";
import CreateCollection from "../Components/CreateCollection";
import Dashboard from "../Components/Dashboard";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute"; // Assuming you have an AdminRoute for admin checks
import SignUp from "../Components/SingUp/SignUp";

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
        path: "/items/:id",
        element: <ItemDetails />,
      },
      {
        path: "/collections",
        element: (
          <PrivateRoute>
            <YourCollectionsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/collections/:id",
        element: <CollectionDetails />,
      },
      {
        path: "/create-collection",
        element: (
          <PrivateRoute>
            <CreateCollection />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        
      },
    ],
  },
]);
