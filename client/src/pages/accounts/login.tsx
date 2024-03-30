import * as React from 'react';
import axios from "axios";

import NavbarComponent from "../../components/navbar";

import { LoginResponseData } from "../../../../shared/types/api/accounts"

const AccountLogin = () => {
    const usernameEmailRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);

    const login = () => {
        axios
            .post<LoginResponseData>("http://localhost:3000/api/accounts/login", {
                emailOrUsername: usernameEmailRef.current!.value,
                password: passwordRef.current!.value,
                tfaCode: "",
            })
            .then((res) => {
                if (res.data.status === "success") {
                    alert("Logged in successfully");
                    window.location.href = "/";
                } else {
                    alert("An error occurred");
                }
            });

        // TODO: Set global user state
        axios
            .post(
                "http://localhost:3000/api/accounts/me",
                {},
                { withCredentials: true }
            )
            .then((res) => {
                console.log(res.data);
            });
    };

    return (
        <div className="bg-gray-800 min-h-screen text-white">
            <NavbarComponent user={null} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-700 rounded-md p-4 w-11/12 md:w-4/12">
                <form>
                    <h1 className="text-2xl font-semibold mb-2">
                        Login to DIMLIM
                    </h1>

                    <div className="my-4">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            ref={usernameEmailRef}
                            className="w-full p-2 bg-gray-800 border-2 border-gray-800 outline-none rounded-md transition-all focus:border-blue-400"
                        />
                    </div>

                    <div className="my-4">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            ref={passwordRef}
                            className="w-full p-2 bg-gray-800 border-2 border-gray-800 outline-none rounded-md transition-all focus:border-blue-400"
                        />
                    </div>

                    <div className="mt-8">
                        <button className="w-full p-2 bg-blue-500 rounded-md">
                            Login
                        </button>
                    </div>

                    <div className="mt-4">
                        Don't have an account yet?{" "}
                        <a href="/register" className="text-blue-400">
                            Register
                        </a>
                    </div>
                </form>

                <button onClick={login}>ejwqioewqeqw</button>
            </div>
        </div>
    );
};

export default AccountLogin;
