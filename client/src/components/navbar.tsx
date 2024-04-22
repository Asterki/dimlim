import * as React from "react";
import { Link } from "react-router-dom";

import { User } from "../../../shared/types/models";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface ComponentProps {
    user: User | null;
}

const NavbarComponent: React.FC<ComponentProps> = (props) => {
    const [menuOpen, setMenuOpen] = React.useState(false);

    return (
        <div className="w-full flex items-center justify-between p-4 h-16 bg-gray-700 shadow-md z-10 absolute top-0">
            <Link to="/home" className="text-2xl text-white font-bold">DIMLIM</Link>
            {props.user && (
                <div className="w-auto md:w-2/12">
                    <DropdownMenu.Root
                        open={menuOpen}
                        onOpenChange={(change) => {
                            setMenuOpen(change);
                        }}
                        
                    >
                        <DropdownMenu.Trigger className="outline-none flex items-center justify-between px-4 py-2 rounded-md border-2 border-white/20 transition-all hover:bg-white/10 cursor-pointer w-full">
                            <div className="flex items-center justify-center">
                                <div>
                                    <img
                                        width={30}
                                        src="https://www.asterki.com/assets/images/icon.png"
                                        alt="wjaoi"
                                        className="mr-2 rounded-full"
                                    />
                                </div>
                                <div>{props.user.profile.username}</div>
                            </div>
                            <div>
                                <FontAwesomeIcon
                                    className={`${
                                        menuOpen ? "transform rotate-180 px-2" : ""
                                    } transition-all text-white/50 px-2`}
                                    icon={faChevronCircleDown}
                                />
                            </div>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content align="end" className="text-white bg-gray-700 transition-all rounded-md border-2 border-white/20 w-12/12">
                                <DropdownMenu.Item className="p-2 transition-all hover:bg-white/20 cursor-pointer w-full">
                                    <Link to="/settings">Settings</Link>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="p-2 transition-all hover:bg-white/20 cursor-pointer w-full">
                                    <Link to="/contacts">Contacts</Link>
                                </DropdownMenu.Item>

                                <DropdownMenu.Item className="p-2 transition-all hover:bg-white/20 cursor-pointer w-full">
                                    <Link to="/contacts">Logout</Link>
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>

                    {/* 
                    <Link to="/contacts">
                        <div>
                            Contacts
                        </div>
                    </Link>
                    <Link to="/contacts">
                        <div>
                            Logout
                        </div>
                    </Link> */}
                </div>
            )}
            {!props.user && (
                <div className="flex items-end justify-end w-1/2 md:w-3/12">
                    <a
                        href="/login"
                        className="mr-2 hover:underline text-white bg-blue-400 rounded-md py-2 w-1/2 text-center"
                    >
                        Login
                    </a>
                    <a
                        href="/register"
                        className="mr-2 hover:underline text-white bg-blue-400 rounded-md py-2 w-1/2 text-center"
                    >
                        Register
                    </a>
                </div>
            )}
        </div>
    );
};

export default NavbarComponent;
