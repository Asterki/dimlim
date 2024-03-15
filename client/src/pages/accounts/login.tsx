import NavbarComponent from "../../components/navbar";

const AccountLogin = () => {
    return (
        <div className="bg-gray-800 min-h-screen text-white">
            <NavbarComponent user={null} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-700 rounded-md p-4 w-4/12">
                <form>
                    <h1 className="text-2xl text-center">Login to DIMLIM</h1>

                    <div className="my-2">
                        <label>Email</label>
                        <input type="email" className="w-full p-2 bg-gray-800 border-2 border-gray-800 outline-none rounded-md transition-all focus:border-blue-400" />
                    </div>

                    <div className="my-2">
                        <label>Password</label>
                        <input type="password" className="w-full p-2 bg-gray-800 border-2 border-gray-800 outline-none rounded-md transition-all focus:border-blue-400" />
                    </div>

                    <div className="mt-4">
                        <button className="w-full p-2 bg-blue-500 rounded-md">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountLogin;
