import { createBrowserRouter } from "react-router-dom";

// Main
import MainIndex from "./main/index";
import MainHome from "./main/home";

// Register
import AccountLogin from "./accounts/login";
import AccountRegister from "./accounts/register";

// Contacts
import ContactsIndex from "./contacts/index";

const router = createBrowserRouter([
    // Main
    {
        path: "/",
        element: <MainIndex />,
    },
    {
        path: "/home",
        element: <MainHome />,
    },

    // Accounts
    {
        path: "/login",
        element: <AccountLogin />,
    },
    {
        path: "/register",
        element: <AccountRegister />,
    },

    // Contacts
    {
        path: "/contacts",
        element: <ContactsIndex />,
    },
]);

export default router;
