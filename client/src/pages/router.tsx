import { createBrowserRouter } from "react-router-dom";

// MainIndex
import MainIndex from "./main/index";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainIndex />,
    },
]);

export default router;
