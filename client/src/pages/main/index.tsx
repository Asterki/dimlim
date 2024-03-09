import NavbarComponent from "../../components/navbar";

const IndexPage = () => {
    return (
        <div className="bg-gray-800 min-h-screen">
            <NavbarComponent user={null} />
            <section className="relative select-none">
                <img
                    src="/assets/images/bg-2.png"
                    alt="Background"
                    className="w-full h-screen overflow-y-hidden object-none shadow-md"
                />
                <div className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white flex items-center justify-center flex-col ">
                    <img src="/assets/images/logo-no-background.png" alt="Logo" className="w-1/4 md:w-2/12" />
                    <h1 className="text-5xl font-bold">DIMLIM</h1> <br />
                    <p className="m-0">Open Source End-To-End Messaging Application</p>

                    <div className="w-full mt-2 flex items-center justify-center flex-col md:flex-row">
                        <button className="bg-blue-400 opacity-95 p-4 rounded-md shadow-md w-8/12 my-2 transition-all hover:brightness-110 md:w-3/12 md:mx-2 md:my-0">Register</button>
                        <button className="bg-neutral-400 opacity-95 p-4 rounded-md shadow-md w-8/12 my-2 transition-all hover:brightness-110 md:w-3/12 md:mx-2 md:my-0">Login</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default IndexPage;
