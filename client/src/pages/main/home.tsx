import * as React from "react";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { setUser } from "../../store/slices/page";

import { checkLoggedIn } from "../../lib/auth";

const HomePage = () => {
    const user = useSelector((state: RootState) => state.page.currentUser);
    const dispatch = useDispatch();

    React.useEffect(() => {
        (async () => {
            console.log(user)

            if (!user) {
                const currentUser = await checkLoggedIn();
                if (currentUser) return dispatch(setUser(currentUser));
                // window.location.href = "/login";
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            {user && (
                <div>
                    <h1>Welcome back, {user}!</h1>
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
