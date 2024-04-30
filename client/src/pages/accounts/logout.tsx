import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { setUser } from "../../store/slices/page";

import NavbarComponent from "../../components/navbar";

import { LoginResponseData } from "../../../../shared/types/api/accounts";
import { checkLoggedIn } from "../../lib/auth";

const AccountLogout = () => {
    const user = useSelector((state: RootState) => state.page.currentUser);
    const dispatch = useDispatch();

    const redirect = useNavigate();

    const logout = async () => {
        axios
            .get(`${import.meta.env.VITE_SERVER_HOST}/api/accounts/logout`, {
                withCredentials: true,
            })
            .then(async () => {
                alert("Logged out successfully");
                dispatch(setUser(null));
                redirect("/login");
            });
    };

    React.useEffect(() => {
        (async () => {
            if (!user) {
                const currentUser = await checkLoggedIn();
                if (currentUser) return dispatch(setUser(currentUser));
                redirect("/login");
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="bg-gray-800 min-h-screen text-white">
            {user && (
                <div>
                    <NavbarComponent user={user} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-700 rounded-md p-4 w-11/12 md:w-4/12">
                        <h1 className="text-2xl font-semibold mb-2">
                            Are you sure you want to log out?
                        </h1>

                        <p>
                            You will be logged out of your account and will have to
                            log back in to access your account.
                        </p>

                        <button
                            onClick={logout}
                            className="w-full bg-red-400 text-white rounded-md p-2 mt-4 hover:brightness-125 transition-all"
                        >
                            Logout
                        </button>

                        <Link
                            to="/home"
                            className="text-center w-full block bg-gray-500 text-white rounded-md p-2 mt-4 hover:brightness-125 transition-all"
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            )}
            {!user && (
                <div>
                    <h1>Authenticating</h1>
                </div>
            )}
        </div>
    );
};

export default AccountLogout;
