import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as Tabs from "@radix-ui/react-tabs";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { setUser } from "../../store/slices/page";

import NavbarComponent from "../../components/navbar";
import { checkLoggedIn } from "../../lib/auth";

const ContactsIndex = () => {
    const user = useSelector((state: RootState) => state.page.currentUser);
    const dispatch = useDispatch();

    const redirect = useNavigate();

    React.useEffect(() => {
        (async () => {
            if (!user) {
                const currentUser = await checkLoggedIn();
                if (currentUser) return dispatch(setUser(currentUser));
                redirect("/login");
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="bg-gray-800 min-h-screen text-white">
            {user && (
                <div>
                    <NavbarComponent user={user} />
                    <div className="pt-20">
                        <div className="text-center">
                            <Tabs.Root className="text-center w-full flex items-center flex-col" defaultValue="tab1">
                                <Tabs.List
                                    className="w-full flex items-center justify-center"
                                    aria-label="Manage your account"
                                >
                                    <Tabs.Trigger
                                        className="p-2 rounded-md bg-gray-700 mx-2 transition-all hover:bg-gray-600 w-2/12"
                                        value="tab1"
                                    >
                                        Requests
                                    </Tabs.Trigger>
                                    <Tabs.Trigger
                                        className="p-2 rounded-md bg-gray-700 mx-2 transition-all hover:bg-gray-600 w-2/12"
                                        value="tab2"
                                    >
                                        Current Contacts
                                    </Tabs.Trigger>
                                    <Tabs.Trigger
                                        className="p-2 rounded-md bg-gray-700 mx-2 transition-all hover:bg-gray-600 w-2/12"
                                        value="tab3"
                                    >
                                        Blocked Contacts
                                    </Tabs.Trigger>
                                </Tabs.List>
                                <Tabs.Content
                                    className="rounded-md bg-gray-700 my-2 w-11/12 text-center p-2 shadow-md"
                                    value="tab1"
                                >
                                    <p className="text-2xl">Contact Requests</p>
                                </Tabs.Content>
                                <Tabs.Content
                                    className="rounded-md bg-gray-700 my-2 w-11/12 text-center p-2 shadow-md"
                                    value="tab2"
                                >
                                    <p className="text-2xl">Current Contacts</p>
                                </Tabs.Content>
                                <Tabs.Content
                                    className="rounded-md bg-gray-700 my-2 w-11/12 text-center p-2 shadow-md"
                                    value="tab3"
                                >
                                    <p className="text-2xl">Blocked Contacts</p>
                                </Tabs.Content>
                            </Tabs.Root>
                        </div>
                    </div>
                </div>
            )}
            {!user && (
                <div>
                    <h1>Authenticating</h1>
                </div>
            )}
        </div>
    );
};

export default ContactsIndex;
