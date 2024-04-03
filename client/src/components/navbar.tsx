import * as React from "react";

import { User } from "../../../shared/types/models";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";

interface ComponentProps {
    user: User | null;
}

const NavbarComponent: React.FC<ComponentProps> = (props) => {
    return (
        <div className="w-full flex items-center justify-between p-4 h-16 bg-gray-700 shadow-md z-10 absolute top-0">
            <h1 className="text-2xl text-white font-bold">DIMLIM</h1>
            {props.user && (
                <div className="flex items-center justify-between px-4 py-2 rounded-md border-2 border-white/20 w-2/12">
                    <div className="flex items-center justify-center">
                        <div>
                            <img
                                width={30}
                                src="https://www.asterki.com/assets/images/icon.png"
                                alt="wjaoi"
                            />
                        </div>
                        <div>{props.user.profile.username}</div>
                    </div>
                    <div>
                        <FontAwesomeIcon className="text-white/80" icon={faChevronCircleDown} />
                    </div>
                </div>
            )}
            {!props.user && (
                <div>
                    <a
                        href="/login"
                        className="mr-2 hover:underline text-white"
                    >
                        Login
                    </a>
                    <a
                        href="/register"
                        className="mr-2 hover:underline text-white"
                    >
                        Register
                    </a>
                </div>
            )}
        </div>
    );
};

export default NavbarComponent;
