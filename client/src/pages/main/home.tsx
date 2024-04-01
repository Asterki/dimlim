import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { setUser } from "../../store/slices/page";

import NavbarComponent from "../../components/navbar";
import { checkLoggedIn } from "../../lib/auth";

const HomePage = () => {
    const user = useSelector((state: RootState) => state.page.currentUser);
    const dispatch = useDispatch();

    const redirect = useNavigate();

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
                    <div className="pt-20">
                        <div className="text-center">
                            <button className="w-11/12 p-2 bg-blue-400 text-white rounded-md shadow-md">
                                Search or start chat
                            </button>
                        </div>
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

export default HomePage;
