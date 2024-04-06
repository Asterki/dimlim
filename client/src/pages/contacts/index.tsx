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

    type Contact = {
        userID: string;
        profile: {
            username: string;
        };
    };
    const [contacts, setContacts] = React.useState<{
        accepted: Contact[];
        blocked: Contact[];
        pending: Contact[];
    }>({
        accepted: [],
        blocked: [],
        pending: [],
    });

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

    React.useEffect(() => {
        (async () => {
            const { data } = await axios.get(
                "http://localhost:3000/api/contacts/get",
                { withCredentials: true }
            );
            console.log(data);
            setContacts(data.contacts);
        })();
    }, []);

    const pending = async (username: string, action: "accept" | "reject") => {
        const { data } = await axios.post(
            "http://localhost:3000/api/contacts/pending",
            { action: action, username },
            { withCredentials: true }
        );
        console.log(data);
    };

    const remove = async (username: string) => {
        const { data } = await axios.post(
            "http://localhost:3000/api/contacts/remove",
            { username },
            { withCredentials: true }
        );
        console.log(data);
    };

    const block = async (username: string) => {
        const { data } = await axios.post(
            "http://localhost:3000/api/contacts/block",
            { username },
            { withCredentials: true }
        );
        console.log(data);
    };

    const unblock = async (username: string) => {
        const { data } = await axios.post(
            "http://localhost:3000/api/contacts/unblock",
            { username },
            { withCredentials: true }
        );
        console.log(data);
    };

    return (
        <div className="bg-gray-800 min-h-screen text-white">
            {user && (
                <div>
                    <NavbarComponent user={user} />
                    <div className="pt-20">
                        <div className="text-center">
                            <Tabs.Root
                                className="text-center w-full flex items-center flex-col"
                                defaultValue="tab1"
                            >
                                <Tabs.List
                                    className="w-full flex items-center justify-center"
                                    aria-label="Manage your account"
                                >
                                    <Tabs.Trigger
                                        className="p-2 rounded-md bg-gray-700 mx-2 transition-all hover:bg-gray-600 w-3/12 md:w-2/12"
                                        value="tab1"
                                    >
                                        Requests
                                    </Tabs.Trigger>
                                    <Tabs.Trigger
                                        className="p-2 rounded-md bg-gray-700 mx-2 transition-all hover:bg-gray-600 w-3/12 md:w-2/12"
                                        value="tab2"
                                    >
                                        Current Contacts
                                    </Tabs.Trigger>
                                    <Tabs.Trigger
                                        className="p-2 rounded-md bg-gray-700 mx-2 transition-all hover:bg-gray-600 w-3/12 md:w-2/12"
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
                                    <div className="flex flex-col items-center">
                                        {contacts.pending.length === 0 && (
                                            <p className="text-xl">
                                                No requests
                                            </p>
                                        )}
                                        {contacts.pending.length > 0 && (
                                            <div className="w-11/12">
                                                {contacts.pending.map(
                                                    (contact) => (
                                                        <div
                                                            key={
                                                                contact.userID as string
                                                            }
                                                            className="bg-gray-600 rounded-md p-2 my-2 flex justify-between items-center"
                                                        >
                                                            <p>
                                                                {
                                                                    contact.profile!
                                                                        .username
                                                                }
                                                            </p>
                                                            <div className="flex">
                                                                <button
                                                                    className="p-2 bg-green-400 transition-all hover:bg-green-500 rounded-md mx-2"
                                                                    onClick={() =>
                                                                        pending(
                                                                            contact.profile!
                                                                                .username,
                                                                            "accept"
                                                                        )
                                                                    }
                                                                >
                                                                    Accept
                                                                </button>
                                                                <button
                                                                    className="p-2 bg-red-400 transition-all hover:bg-red-500 rounded-md"
                                                                    onClick={() =>
                                                                        pending(
                                                                            contact.profile!
                                                                                .username,
                                                                            "reject"
                                                                        )
                                                                    }
                                                                >
                                                                    Decline
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Tabs.Content>
                                <Tabs.Content
                                    className="rounded-md bg-gray-700 my-2 w-11/12 text-center p-2 shadow-md"
                                    value="tab2"
                                >
                                    <p className="text-2xl">Current Contacts</p>
                                    <div className="w-11/12">
                                        {contacts.accepted.length === 0 && (
                                            <p className="text-xl">
                                                No contacts
                                            </p>
                                        )}
                                        {contacts.accepted.length > 0 && (
                                            <div>
                                                {contacts.accepted.map(
                                                    (contact) => (
                                                        <div
                                                            key={
                                                                contact.userID as string
                                                            }
                                                            className="bg-gray-600 rounded-md p-2 my-2 flex justify-between items-center"
                                                        >
                                                            <p>
                                                                {
                                                                    contact.profile!
                                                                        .username
                                                                }
                                                            </p>
                                                            <div className="flex">
                                                                <button
                                                                    className="p-2 bg-red-400 rounded-md"
                                                                    onClick={() =>
                                                                        remove(
                                                                            contact.profile!
                                                                                .username
                                                                        )
                                                                    }
                                                                >
                                                                    Block
                                                                </button>
                                                                <button
                                                                    className="p-2 bg-red-400 rounded-md"
                                                                    onClick={() =>
                                                                        remove(
                                                                            contact.profile!
                                                                                .username
                                                                        )
                                                                    }
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Tabs.Content>
                                <Tabs.Content
                                    className="rounded-md bg-gray-700 my-2 w-11/12 text-center p-2 shadow-md"
                                    value="tab3"
                                >
                                    <p className="text-2xl">Blocked Contacts</p>
                                    <div className="w-11/12">
                                        {contacts.blocked.length === 0 && (
                                            <p className="text-xl">
                                                No contacts
                                            </p>
                                        )}
                                        {contacts.blocked.length > 0 && (
                                            <div>
                                                {contacts.blocked.map(
                                                    (contact) => (
                                                        <div
                                                            key={
                                                                contact.userID as string
                                                            }
                                                            className="bg-gray-600 rounded-md p-2 my-2 flex justify-between items-center"
                                                        >
                                                            <p>
                                                                {
                                                                    contact.profile!
                                                                        .username
                                                                }
                                                            </p>
                                                            <button
                                                                className="p-2 bg-green-400 rounded-md"
                                                                onClick={() =>
                                                                    unblock(
                                                                        contact.profile!
                                                                            .username
                                                                    )
                                                                }
                                                            >
                                                                Unblock
                                                            </button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
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
