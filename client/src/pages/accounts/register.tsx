import * as React from "react";
import { redirect, Link } from "react-router-dom";
import axios from "axios";
import validator from "validator";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { setUser } from "../../store/slices/page";

import NavbarComponent from "../../components/navbar";
import NotificationComponent from "../../components/notifications";

import { checkLoggedIn } from "../../lib/auth";

const AccountRegister = () => {
    const user = useSelector((state: RootState) => state.page.currentUser);
    const dispatch = useDispatch();

    // Notification state
    const [notification, setNotification] = React.useState<{
        state: "showing" | "hidden";
        title: string;
        content: string;
        type: "error" | "success" | "info" | "warning";
    }>({
        state: "hidden",
        title: "",
        content: "",
        type: "info",
    });

    const showNotification = (
        title: string,
        content: string,
        type: "warning" | "info" | "success" | "error"
    ) => {
        setNotification({
            state: "showing",
            title: title,
            content: content,
            type: type,
        });

        setTimeout(() => {
            setNotification({
                state: "hidden",
                title: "",
                content: "",
                type: "info",
            });
        }, 5000);
    };

    const usernameRef = React.useRef<HTMLInputElement>(null);
    const emailRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);
    const repeatPasswordRef = React.useRef<HTMLInputElement>(null);

    const register = () => {
        const username = usernameRef.current!.value;
        const email = emailRef.current!.value;
        const password = passwordRef.current!.value;
        const repeatPassword = repeatPasswordRef.current!.value;

        if (username.length < 3 || username.length > 20)
            return showNotification(
                "Failed to register",
                "Username must be between 3 and 20 characters",
                "error"
            );

        if (!validator.isEmail(email))
            return showNotification(
                "Failed to register",
                "Invalid email",
                "error"
            );

        if (validator.isStrongPassword(password) === false)
            return showNotification(
                "Failed to register",
                "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 symbol",
                "error"
            );

        if (password !== repeatPassword)
            return showNotification(
                "Failed to register",
                "Passwords do not match",
                "error"
            );

        try {
            axios
                .post(
                    `${import.meta.env.VITE_SERVER_HOST}/api/accounts/register`,
                    {
                        username: username,
                        email: email,
                        password: password,
                    }
                )
                .then((res) => {
                    if (res.data.status == "success") {
                        showNotification(
                            "Registered successfully",
                            "You have been registered successfully",
                            "success"
                        );

                        return redirect("/home");
                    } else if (res.data.status == "user-exists") {
                        showNotification(
                            "Failed to register",
                            "User already exists",
                            "error"
                        );
                    }
                });
        } catch (err) {
            console.log(err);
            showNotification(
                "Failed to register",
                "An error occurred",
                "error"
            );
        }
    };

    // Login-protect the page
    React.useEffect(() => {
        (async () => {
            if (!user) {
                const currentUser = await checkLoggedIn();
                if (currentUser) {
                    dispatch(setUser(currentUser));
                    return redirect("/home");
                }
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="bg-gray-800 min-h-screen text-white">
            <NavbarComponent user={null} />

            <NotificationComponent
                content={notification.content}
                title={notification.title}
                state={notification.state}
                type={notification.type}
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-700 rounded-md p-4 w-11/12 md:w-4/12">
                <form>
                    <h1 className="text-2xl font-semibold mb-2">
                        Register to DIMLIM
                    </h1>

                    <div className="my-4">
                        <label>Username</label>
                        <input
                            type="text"
                            ref={usernameRef}
                            placeholder="Your username"
                            className="w-full p-2 bg-gray-800 border-2 border-gray-800 outline-none rounded-md transition-all focus:border-blue-400"
                        />
                    </div>

                    <div className="my-4">
                        <label>Email</label>
                        <input
                            type="email"
                            ref={emailRef}
                            placeholder="Your email (will be verified)"
                            className="w-full p-2 bg-gray-800 border-2 border-gray-800 outline-none rounded-md transition-all focus:border-blue-400"
                        />
                    </div>

                    <div className="my-4">
                        <label>Password</label>
                        <input
                            type="password"
                            ref={passwordRef}
                            placeholder="••••••••"
                            className="w-full p-2 bg-gray-800 border-2 border-gray-800 outline-none rounded-md transition-all focus:border-blue-400"
                        />
                    </div>

                    <div className="my-4">
                        <label>Repeat Password</label>
                        <input
                            type="password"
                            ref={repeatPasswordRef}
                            placeholder="••••••••"
                            className="w-full p-2 bg-gray-800 border-2 border-gray-800 outline-none rounded-md transition-all focus:border-blue-400"
                        />
                    </div>

                    <div className="mt-8">
                        <button
                            className="w-full p-2 bg-blue-500 rounded-md"
                            type="button"
                            onClick={register}
                        >
                            Register
                        </button>
                    </div>

                    <div className="mt-4">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-400">
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountRegister;
