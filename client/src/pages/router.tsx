import { createBrowserRouter } from "react-router-dom";

// MainIndex
import MainIndex from "./main/index";

// Register
import AccountLogin from "./accounts/login"
import AccountRegister from "./accounts/register"

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainIndex />,
    },
    {
        path: "/login",
        element: <AccountLogin />,
    },
    {
        path: "/register",
        element: <AccountRegister />,
    },
]);

export default router;
