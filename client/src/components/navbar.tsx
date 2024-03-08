import * as React from "react";

interface ComponentProps {
    user: string | null;
}

const NavbarComponent: React.FC<ComponentProps> = (props) => {
    return (
        <div className="w-full flex items-center justify-between p-4">
            <h1 className="text-2xl text-white font-bold">DIMLIM</h1>
            {props.user && (
                <div>
                    <a href="/" className="mr-2 hover:underline text-white">
                        Link 1
                    </a>
                    <a href="/" className="mr-2 hover:underline text-white">
                        Link 2
                    </a>
                    <a href="/" className="mr-2 hover:underline text-white">
                        Link 3
                    </a>
                </div>
            )}
            {!props.user && (
                <div>
                    <a href="/login" className="mr-2 hover:underline text-white">
                        Login
                    </a>
                    <a href="/register" className="mr-2 hover:underline text-white">
                        Register
                    </a>
                </div>
            )}
        </div>
    );
};

export default NavbarComponent;
