import { createBrowserRouter } from "react-router-dom";

// Main
import MainIndex from "./main/index";
import MainHome from "./main/home";

// Accounts
import AccountLogin from "./accounts/login";
import AccountRegister from "./accounts/register";
import AccountLogout from "./accounts/logout";

// Contacts
import ContactsIndex from "./contacts/index";

// Settings
import SettingsIndex from "./settings";

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
    {
        path: "/logout",
        element: <AccountLogout />,
    },

    // Contacts
    {
        path: "/contacts",
        element: <ContactsIndex />,
    },

    // Settings
    {
        path: "/settings",
        element: <SettingsIndex />,
    },
]);

export default router;
