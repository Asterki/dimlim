import * as React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { User } from "../../../shared/types/models";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";

interface ComponentProps {
    user: User | null;
}

const NavbarComponent: React.FC<ComponentProps> = (props) => {
    const [menuOpen, setMenuOpen] = React.useState(false);

    return (
        <div className="w-full flex items-center justify-between p-4 h-16 bg-gray-700 shadow-md z-10 absolute top-0">
            <h1 className="text-2xl text-white font-bold">DIMLIM</h1>
            {props.user && (
                <div className="w-2/12 relative">
                    <div
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex items-center justify-between px-4 py-2 rounded-md border-2 border-white/20 transition-all hover:bg-white/10 cursor-pointer w-full"
                    >
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
                                className="text-white/80"
                                icon={faChevronCircleDown}
                            />
                        </div>
                    </div>

                    <motion.div
                        variants={{
                            open: {
                                y: "auto",
                                display: "block",
                                opacity: 1,
                            },
                            closed: {
                                y: 0,
                                opacity: 0,
                                transitionEnd: {
                                    display: "none",
                                },
                            },
                        }}
                        initial="closed"
                        animate={menuOpen ? "open" : "closed"}
                        className="w-full absolute bg-gray-700 rounded-md border-2 border-white/20 mt-2 p-2 "
                    >
                        <Link to="/contacts">
                            <div className="p-2 transitiona-all hover:bg-white/20 rounded-md cursor-pointer w-full">
                                Settings
                            </div>
                        </Link>
                        <Link to="/contacts">
                            <div className="p-2 transitiona-all hover:bg-white/20 rounded-md cursor-pointer w-full">
                                Contacts
                            </div>
                        </Link>
                        <Link to="/contacts">
                            <div className="p-2 transitiona-all hover:bg-white/20 rounded-md cursor-pointer w-full">
                                Logout
                            </div>
                        </Link>
                    </motion.div>
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
