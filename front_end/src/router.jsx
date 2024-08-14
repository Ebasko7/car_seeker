import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import GaragePage from "./pages/GaragePage";
import BountyListPage from "./pages/BountyListPage"
import MarketplacePage from "./pages/MarketplacePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VinDecoderPage from "./pages/VinDecoderPage";
import { userConfirmation } from "./utilities.jsx";

//REACT-ROUTER-DOM FUNCTION, WRAPS THE APPLICATION AND ENABLES ROUTING BETWEEN PAGES
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    //RUNS USERCONFIRMATION FUNCTION FROM UTILITIES.JSX BEFORE APP.JSX RENDERS.  
    loader: async () => {
      const isAuthenticated = await userConfirmation()
      return { isAuthenticated }
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
      },
      {
        path: "decoder/",
        element: <VinDecoderPage />,
      }
    ],
    errorElement: <NotFoundPage/>
  },
])

export default router