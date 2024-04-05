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
            <h1 className="text-2xl text-white font-bold">DIMLIM</h1>
            {props.user && (
                <div className="w-2/12">
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
                                        menuOpen ? "transform rotate-180" : ""
                                    } transition-all text-white/50`}
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
