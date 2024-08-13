// router.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import GaragePage from "./pages/GaragePage";
import BountyListPage from "./pages/BountyListPage"
import MarketplacePage from "./pages/MarketplacePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { userConfirmation } from "./utilities.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: async () => {
      const isAuthenticated = await userConfirmation();
      return { isAuthenticated };
    },
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login/",
        element: <LoginPage />
      },
      {
        path: "signup/",
        element: <SignupPage />
      },
      {
        path: "garage/",
        element: <GaragePage />,
      },
      {
        path: "bountylist/",
        element: <BountyListPage />,
      },
      {
        path: "marketplace/",
        element: <MarketplacePage />,
      }
    ],
    errorElement: <NotFoundPage/>
  },
]);

export default router;