import * as React from "react";
import axios from "axios";

import validator from "validator";

import NavbarComponent from "../../components/navbar";

const AccountRegister = () => {
    const usernameRef = React.useRef<HTMLInputElement>(null);
    const emailRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);
    const repeatPasswordRef = React.useRef<HTMLInputElement>(null);

    const register = (e: React.MouseEvent) => {
        e.preventDefault();

        const username = usernameRef.current!.value;
        const email = emailRef.current!.value;
        const password = passwordRef.current!.value;
        const repeatPassword = repeatPasswordRef.current!.value;

        if (username.length < 3 || username.length > 20) {
            alert("Username must be between 3 and 20 characters");
            return;
        }

        if (!validator.isEmail(email)) {
            alert("Invalid email");
            return;
        }

        if (validator.isStrongPassword(password) === false) {
            alert(
                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character"
            );
            return;
        }

        if (password !== repeatPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            axios
                .post("http://localhost:5000/api/auth/register", {
                    username: username,
                    email: email,
                    password: password,
                })
                .then((res) => {
                    if (res.status === 200) {
                        alert("Account created successfully");
                        window.location.href = "/";
                    }
                });
        } catch (err) {
            console.log(err);
            alert("An error occurred");
        }
    };

    return (
        <div className="bg-gray-800 min-h-screen text-white">
            <NavbarComponent user={null} />
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
                            className="w-full p-2 bg-gray-800 border-2 border-gray-800 outline-none rounded-md transition-all focus:border-blue-400"
                        />
                    </div>

                    <div className="my-4">
                        <label>Email</label>
                        <input
                            type="email"
                            ref={emailRef}
                            className="w-full p-2 bg-gray-800 border-2 border-gray-800 outline-none rounded-md transition-all focus:border-blue-400"
                        />
                    </div>

                    <div className="my-4">
                        <label>Password</label>
                        <input
                            type="password"
                            ref={passwordRef}
                            className="w-full p-2 bg-gray-800 border-2 border-gray-800 outline-none rounded-md transition-all focus:border-blue-400"
                        />
                    </div>

                    <div className="my-4">
                        <label>Repeat Password</label>
                        <input
                            type="password"
                            ref={repeatPasswordRef}
                            className="w-full p-2 bg-gray-800 border-2 border-gray-800 outline-none rounded-md transition-all focus:border-blue-400"
                        />
                    </div>

                    <div className="mt-8">
                        <button
                            className="w-full p-2 bg-blue-500 rounded-md"
                            onClick={(e) => {
                                register(e);
                            }}
                        >
                            Register
                        </button>
                    </div>

                    <div className="mt-4">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-400">
                            Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountRegister;