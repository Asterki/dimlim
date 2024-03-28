import axios from "axios";

import NavbarComponent from "../../components/navbar";

const AccountLogin = () => {
    const login = () => {
        axios
            .post("http://localhost:3000/api/accounts/login", {
                emailOrUsername: "asterki2",
                tfaCode: "asterki2.dev@proton.me",
                password: "",
                // repeatPassword: "password",
            })
            .then((res) => {
                console.log(res.data);
            });

        axios
            .post("http://localhost:3000/api/accounts/me", {}, { withCredentials: true,  })
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
                            className="w-full p-2 bg-gray-800 border-2 border-gray-800 outline-none rounded-md transition-all focus:border-blue-400"
                        />
                    </div>

                    <div className="my-4">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
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
