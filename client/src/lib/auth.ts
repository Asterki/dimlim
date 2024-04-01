import axios from "axios";

import { MeResponseData } from "../../../shared/types/api/accounts";

const checkLoggedIn = async () => {
    try {
        const response = await axios.get<MeResponseData>(
            "http://localhost:3000/api/accounts/me",
            { withCredentials: true }
        );

        if (response.data.status == "success") return response.data.user;
        else return null;
    } catch (error) {
        return null;
    }
};

export { checkLoggedIn };
