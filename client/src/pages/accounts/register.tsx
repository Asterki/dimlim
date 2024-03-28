import axios from "axios";

import NavbarComponent from "../../components/navbar";

const AccountRegister = () => {
    const register = () => {
        axios
            .post("http://localhost:3000/api/accounts/register", {
                username: "aster",
                email: "asterki.dev@proton.me",
                password: "NO0o=r]@v6~b`vO16>A:dLnQE1n-,Mm@",
                // repeatPassword: "password",
            })
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
                        Register to DIMLIM
                    </h1>

                    <div className="my-4">
                        <label>Name</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-800 border-2 border-gray-800 outline-none rounded-md transition-all focus:border-blue-400"
                        />
                    </div>

                    <div className="my-4">
                        <label>Email</label>
                        <input
                            type="email"
                            className="w-full p-2 bg-gray-800 border-2 border-gray-800 outline-none rounded-md transition-all focus:border-blue-400"
                        />
                    </div>

                    <div className="my-4">
                        <label>Password</label>
                        <input
                            type="password"
                            className="w-full p-2 bg-gray-800 border-2 border-gray-800 outline-none rounded-md transition-all focus:border-blue-400"
                        />
                    </div>

                    <div className="my-4">
                        <label>Repeat Password</label>
                        <input
                            type="password"
                            className="w-full p-2 bg-gray-800 border-2 border-gray-800 outline-none rounded-md transition-all focus:border-blue-400"
                        />
                    </div>

                    <div className="mt-8">
                        <button
                            className="w-full p-2 bg-blue-500 rounded-md"
                            onClick={register}
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
                <button
                            className="w-full p-2 bg-blue-500 rounded-md"
                            onClick={register}
                        >
                            Register
                        </button>
            </div>
        </div>
    );
};

export default AccountRegister;
