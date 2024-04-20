import * as React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as Tabs from "@radix-ui/react-tabs";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setUser } from "../store/slices/page";

import NavbarComponent from "../components/navbar";
import { checkLoggedIn } from "../lib/auth";

const SettingsIndex = () => {
    const user = useSelector((state: RootState) => state.page.currentUser);
    const dispatch = useDispatch();

    const redirect = useNavigate();

    React.useEffect(() => {
        (async () => {
            if (!user) {
                const currentUser = await checkLoggedIn();
                if (currentUser) dispatch(setUser(currentUser));
                else return redirect("/login");
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [tab, setTab] = React.useState("tab1");

    return (
        <div className="bg-gray-800 min-h-screen text-white">
            {user && (
                <div>
                    <NavbarComponent user={user} />

                    <div className="pt-20">
                        <div className="text-center flex items-center justify-center">
                            <Tabs.Root
                                className="text-center w-11/12 md:w-8/12 flex justify-center items-center flex-col "
                                defaultValue="tab1"
                                onValueChange={(e) => {
                                    setTab(e);
                                }}
                            >
                                <Tabs.List
                                    className="w-full flex justify-self-center shadow-md border-b-2 border-gray-800"
                                    aria-label="Manage your account"
                                >
                                    <Tabs.Trigger
                                        className={`p-2 rounded-tl-md transition-all w-3/12 md:w-1/4 border-r-2 border-gray-800 ${
                                            tab == "tab1"
                                                ? "bg-purple-400 shadow-2xl z-20"
                                                : "bg-gray-700 hover:brightness-125"
                                        }`}
                                        value="tab1"
                                    >
                                        General
                                    </Tabs.Trigger>
                                    <Tabs.Trigger
                                        className={`p-2 transition-all w-3/12 md:w-1/4 border-r-2 border-gray-800 ${
                                            tab == "tab2"
                                                ? "bg-purple-400 shadow-2xl z-20"
                                                : "bg-gray-700 hover:brightness-125"
                                        }`}
                                        value="tab2"
                                    >
                                        Notifications
                                    </Tabs.Trigger>
                                    <Tabs.Trigger
                                        className={`p-2 transition-all w-3/12 md:w-1/4 ${
                                            tab == "tab3"
                                                ? "bg-purple-400 shadow-2xl z-20"
                                                : "bg-gray-700 hover:brightness-125"
                                        }`}
                                        value="tab3"
                                    >
                                        Privacy
                                    </Tabs.Trigger>
                                    <Tabs.Trigger
                                        className={`p-2 rounded-tr-md transition-all w-3/12 md:w-1/4 border-l-2 border-gray-800 ${
                                            tab == "tab4"
                                                ? "bg-purple-400 shadow-2xl z-20"
                                                : "bg-gray-700 hover:brightness-125"
                                        }`}
                                        value="tab4"
                                    >
                                        Security
                                    </Tabs.Trigger>
                                </Tabs.List>
                                <Tabs.Content
                                    className="rounded-br-md rounded-bl-md bg-gray-700 w-full text-center p-2 shadow-md"
                                    value="tab1"
                                >
                                    ewq
                                </Tabs.Content>
                                <Tabs.Content
                                    className="rounded-br-md rounded-bl-md bg-gray-700 w-full text-center p-2 shadow-md"
                                    value="tab2"
                                >
                                    ewq
                                </Tabs.Content>
                                <Tabs.Content
                                    className="rounded-br-md rounded-bl-md bg-gray-700 w-full text-center p-2 shadow-md"
                                    value="tab3"
                                >
                                    ewq
                                </Tabs.Content>
                                <Tabs.Content
                                    className="rounded-br-md rounded-bl-md bg-gray-700 w-full text-center p-2 shadow-md"
                                    value="tab4"
                                >
                                    ewq
                                </Tabs.Content>
                            </Tabs.Root>
                        </div>
                    </div>
                </div>
            )}
            {!user && <div>Loading...</div>}
        </div>
    );
};

export default SettingsIndex;
