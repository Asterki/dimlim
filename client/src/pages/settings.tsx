/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";

import * as Tabs from "@radix-ui/react-tabs";
import * as Select from "@radix-ui/react-select";
import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setUser } from "../store/slices/page";

import NavbarComponent from "../components/navbar";
import { checkLoggedIn } from "../lib/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

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

    const tfaInput = React.useRef<HTMLInputElement>(null);

    const [tab, setTab] = React.useState("tab1");
    const [userLoaded, setUserLoaded] = React.useState(false);
    const [secret, setSecret] = React.useState({
        ascii: "",
        base32: "",
        hex: "",
        otpauth_url: "",
        image: "",
    });

    // Settings
    const [generalSettings, setGeneralSettings] = React.useState({
        theme: "light",
        language: "en",
    });

    const [notificationsSettings, setNotificationsSettings] = React.useState({
        showNotifications: true,
        playSound: true,
    });

    const [privacySettings, setPrivacySettings] = React.useState({
        showOnlineStatus: true,
        showLastSeen: true,
        showReadReceipts: true,
    });

    const [securitySettings, setSecuritySettings] = React.useState<{
        twoFactor: {
            active: boolean;
            secret?: string | undefined;
        };
        password: string;
    }>({
        twoFactor: {
            active: false,
            secret: undefined,
        },
        password: "",
    });

    const generateSecret = async () => {
        const response = await axios.get(
            "http://localhost:3000/api/utils/generate-tfa"
        );
        if (response.data.status === "success") {
            QRCode.toDataURL(response.data.data.otpauth_url, (err, url) => {
                if (err) console.error(err);
                setSecret({
                    ...response.data.data,
                    image: url,
                });
            });
        }
    };

    const verifyCode = async () => {
        const code = tfaInput.current?.value;

        const response = await axios.post(
            "http://localhost:3000/api/utils/verify-tfa",
            {
                code,
                secret: secret.base32,
            }
        );
        if (response.data.status === "success") {
            setSecuritySettings({
                ...securitySettings,
                twoFactor: {
                    active: true,
                    secret: secret.base32,
                },
            });
        }
    };

    // Update the user preferences when the settings change
    React.useEffect(() => {
        if (user && userLoaded) {
            dispatch(
                setUser({
                    ...user,
                    preferences: {
                        ...user.preferences,
                        general: generalSettings,
                    },
                })
            );

            const response = axios.post(
                "http://localhost:3000/api/settings/general",
                {
                    ...generalSettings,
                },
                { withCredentials: true }
            );

            console.log(response);
        }
    }, [generalSettings]);

    React.useEffect(() => {
        if (user && userLoaded) {
            dispatch(
                setUser({
                    ...user,
                    preferences: {
                        ...user.preferences,
                        notifications: notificationsSettings,
                    },
                })
            );

            const response = axios.post(
                "http://localhost:3000/api/settings/notifications",
                {
                    ...notificationsSettings,
                },
                { withCredentials: true }
            );

            console.log(response);
        }
    }, [notificationsSettings]);

    React.useEffect(() => {
        if (user && userLoaded) {
            dispatch(
                setUser({
                    ...user,
                    preferences: {
                        ...user.preferences,
                        privacy: privacySettings,
                    },
                })
            );

            const response = axios.post(
                "http://localhost:3000/api/settings/privacy",
                {
                    ...privacySettings,
                },
                { withCredentials: true }
            );

            console.log(response);
        }
    }, [privacySettings]);

    React.useEffect(() => {
        if (user && userLoaded) {
            dispatch(
                setUser({
                    ...user,
                    preferences: {
                        ...user.preferences,
                        security: securitySettings,
                    },
                })
            );

            const response = axios.post(
                "http://localhost:3000/api/settings/security",
                {
                    ...securitySettings,
                },
                { withCredentials: true }
            );

            console.log(response);
        }
    }, [securitySettings]);

    // Load the user preferences when the user is loaded
    React.useEffect(() => {
        if (user) {
            setGeneralSettings(user.preferences.general);
            setNotificationsSettings(user.preferences.notifications);
            setPrivacySettings(user.preferences.privacy);
            setSecuritySettings(user.preferences.security);

            setUserLoaded(true);
        }
    }, [user]);

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
                                    <div className="grid grid-cols-2">
                                        <div className="flex flex-col items-center justify-center">
                                            <h1 className="text-2xl">Theme</h1>

                                            <Select.Root
                                                defaultValue={
                                                    generalSettings.theme
                                                }
                                                onValueChange={(val) => {
                                                    setGeneralSettings({
                                                        ...generalSettings,
                                                        theme: val,
                                                    });
                                                }}
                                            >
                                                <Select.Trigger className="bg-gray-800 rounded-md p-2 w-7/12 flex justify-between">
                                                    <Select.Value placeholder="Select a theme" />
                                                    <Select.Icon className="ml-2">
                                                        <FontAwesomeIcon
                                                            icon={faChevronDown}
                                                        />
                                                    </Select.Icon>
                                                </Select.Trigger>

                                                <Select.Portal>
                                                    <Select.Content
                                                        side="bottom"
                                                        align="end"
                                                        className="z-50 bg-gray-800 shadow-md rounded-md p-2 text-white outline-none"
                                                    >
                                                        <Select.Viewport className="flex flex-col gap-2">
                                                            <Select.Item
                                                                value="light"
                                                                className="hover:bg-gray-700 p-2 rounded-md transition-all cursor-pointer data-[state=checked]:bg-blue-400 outline-none"
                                                            >
                                                                <Select.ItemText>
                                                                    Light Theme
                                                                </Select.ItemText>
                                                            </Select.Item>
                                                            <Select.Item
                                                                value="dark"
                                                                className="data-[state=checked]:bg-blue-400 hover:bg-gray-700 p-2 rounded-md transition-all cursor-pointer outline-none"
                                                            >
                                                                <Select.ItemText>
                                                                    Dark Theme
                                                                </Select.ItemText>
                                                            </Select.Item>
                                                        </Select.Viewport>
                                                    </Select.Content>
                                                </Select.Portal>
                                            </Select.Root>
                                        </div>

                                        <div className="flex flex-col items-center justify-center">
                                            <h1 className="text-2xl">
                                                Language
                                            </h1>

                                            <Select.Root
                                                defaultValue={
                                                    generalSettings.language
                                                }
                                                onValueChange={(val) => {
                                                    setGeneralSettings({
                                                        ...generalSettings,
                                                        language: val,
                                                    });
                                                }}
                                            >
                                                <Select.Trigger className="bg-gray-800 rounded-md p-2 w-7/12 flex justify-between">
                                                    <Select.Value placeholder="Select a language" />
                                                    <Select.Icon className="ml-2">
                                                        <FontAwesomeIcon
                                                            icon={faChevronDown}
                                                        />
                                                    </Select.Icon>
                                                </Select.Trigger>

                                                <Select.Portal>
                                                    <Select.Content
                                                        side="bottom"
                                                        align="end"
                                                        className="z-50 bg-gray-800 shadow-md rounded-md p-2 text-white w-full outline-none"
                                                    >
                                                        <Select.Viewport className="flex flex-col gap-2">
                                                            <Select.Item
                                                                value="en"
                                                                className="hover:bg-gray-700 p-2 rounded-md transition-all cursor-pointer data-[state=checked]:bg-blue-400 outline-none"
                                                            >
                                                                <Select.ItemText>
                                                                    English
                                                                </Select.ItemText>
                                                            </Select.Item>
                                                            <Select.Item
                                                                value="es"
                                                                className="data-[state=checked]:bg-blue-400 hover:bg-gray-700 p-2 rounded-md transition-all cursor-pointer outline-none"
                                                            >
                                                                <Select.ItemText>
                                                                    Spanish
                                                                </Select.ItemText>
                                                            </Select.Item>
                                                        </Select.Viewport>
                                                    </Select.Content>
                                                </Select.Portal>
                                            </Select.Root>
                                        </div>
                                    </div>
                                </Tabs.Content>
                                <Tabs.Content
                                    className="rounded-br-md rounded-bl-md bg-gray-700 w-full text-center p-2 shadow-md"
                                    value="tab2"
                                >
                                    <div className="flex items-center gap-2 my-2">
                                        <Switch.Root
                                            defaultChecked={
                                                notificationsSettings.showNotifications
                                            }
                                            onCheckedChange={(val) =>
                                                setNotificationsSettings({
                                                    ...notificationsSettings,
                                                    showNotifications: val,
                                                })
                                            }
                                            className="w-[42px] h-[25px] rounded-full relative bg-gray-800  data-[state=checked]:bg-blue-400 transition-all outline-none cursor-default"
                                        >
                                            <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
                                        </Switch.Root>
                                        <h1>Show notifications</h1>
                                    </div>
                                    <div className="flex items-center gap-2 my-2">
                                        <Switch.Root
                                            defaultChecked={
                                                notificationsSettings.showNotifications
                                            }
                                            onCheckedChange={(val) =>
                                                setNotificationsSettings({
                                                    ...notificationsSettings,
                                                    playSound: val,
                                                })
                                            }
                                            className="w-[42px] h-[25px] rounded-full relative bg-gray-800  data-[state=checked]:bg-blue-400 transition-all outline-none cursor-default"
                                        >
                                            <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
                                        </Switch.Root>
                                        <h1>Play notification sound</h1>
                                    </div>
                                </Tabs.Content>
                                <Tabs.Content
                                    className="rounded-br-md rounded-bl-md bg-gray-700 w-full text-center p-2 shadow-md"
                                    value="tab3"
                                >
                                    <div className="flex items-center gap-2 my-2">
                                        <Switch.Root
                                            defaultChecked={
                                                privacySettings.showOnlineStatus
                                            }
                                            onCheckedChange={(val) =>
                                                setPrivacySettings({
                                                    ...privacySettings,
                                                    showOnlineStatus: val,
                                                })
                                            }
                                            className="w-[42px] h-[25px] rounded-full relative bg-gray-800  data-[state=checked]:bg-blue-400 transition-all outline-none cursor-default"
                                        >
                                            <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
                                        </Switch.Root>
                                        <h1>Show online status</h1>
                                    </div>
                                    <div className="flex items-center gap-2 my-2">
                                        <Switch.Root
                                            defaultChecked={
                                                privacySettings.showLastSeen
                                            }
                                            onCheckedChange={(val) =>
                                                setPrivacySettings({
                                                    ...privacySettings,
                                                    showLastSeen: val,
                                                })
                                            }
                                            className="w-[42px] h-[25px] rounded-full relative bg-gray-800  data-[state=checked]:bg-blue-400 transition-all outline-none cursor-default"
                                        >
                                            <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
                                        </Switch.Root>
                                        <h1>Show last seen</h1>
                                    </div>
                                    <div className="flex items-center gap-2 my-2">
                                        <Switch.Root
                                            defaultChecked={
                                                privacySettings.showReadReceipts
                                            }
                                            onCheckedChange={(val) =>
                                                setPrivacySettings({
                                                    ...privacySettings,
                                                    showReadReceipts: val,
                                                })
                                            }
                                            className="w-[42px] h-[25px] rounded-full relative bg-gray-800  data-[state=checked]:bg-blue-400 transition-all outline-none cursor-default"
                                        >
                                            <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
                                        </Switch.Root>
                                        <h1>Show read receipts</h1>
                                    </div>
                                </Tabs.Content>
                                <Tabs.Content
                                    className="rounded-br-md rounded-bl-md bg-gray-700 w-full text-center p-2 shadow-md"
                                    value="tab4"
                                >
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2 items-center">
                                            <Dialog.Root>
                                                <Dialog.Trigger className="bg-blue-400 rounded-md p-2 shadow-md w-3/12">
                                                    Change password
                                                </Dialog.Trigger>
                                                <Dialog.Portal>
                                                    <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-20" />
                                                    <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-gray-700 p-4 text-white focus:outline-none z-30 flex items-center flex-col gap-2">
                                                        <h1 className="text-2xl">
                                                            Change Password
                                                        </h1>
                                                        <input
                                                            type="password"
                                                            className="bg-gray-800 rounded-md p-2 text-white w-full"
                                                            placeholder="Current Password"
                                                        />
                                                        <input
                                                            type="password"
                                                            className="bg-gray-800 rounded-md p-2 text-white w-full"
                                                            placeholder="New Password"
                                                        />
                                                        <input
                                                            type="password"
                                                            className="bg-gray-800 rounded-md p-2 text-white w-full"
                                                            placeholder="Confirm New Password"
                                                        />
                                                        <button className="p-2 bg-blue-400 rounded-md mt-2 w-1/2">
                                                            Submit
                                                        </button>
                                                    </Dialog.Content>
                                                </Dialog.Portal>
                                            </Dialog.Root>
                                            <p>
                                                Last Changed:{" "}
                                                {new Date(
                                                    Date.now()
                                                ).toString()}
                                            </p>
                                        </div>

                                        <div className="flex gap-2 items-center">
                                            <Dialog.Root
                                                onOpenChange={() => {
                                                    generateSecret();
                                                }}
                                            >
                                                <Dialog.Trigger className="bg-blue-400 rounded-md p-2 shadow-md w-3/12">
                                                    Two Factor Authentication
                                                </Dialog.Trigger>
                                                <Dialog.Portal>
                                                    <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-20" />
                                                    <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-gray-700 p-4 text-white focus:outline-none z-30 flex flex-col items-center">
                                                        <h1 className="text-2xl">
                                                            Scan with your
                                                            device
                                                        </h1>
                                                        <img
                                                            src={secret.image}
                                                            alt=""
                                                        />
                                                        <input
                                                            type="text"
                                                            value={
                                                                secret.base32
                                                            }
                                                            className="bg-gray-800 rounded-md w-full p-2 my-2"
                                                        />

                                                        <p className="text-center">
                                                            Scan the QR code
                                                            with your device to
                                                            enable two factor
                                                            authentication
                                                        </p>

                                                        <input
                                                            type="text"
                                                            ref={tfaInput}
                                                            className="bg-gray-800 rounded-md p-2 text-white w-full"
                                                            placeholder="Code Generated by your app"
                                                        />
                                                        <button
                                                            className="p-2 bg-blue-400 rounded-md mt-2 w-1/2"
                                                            onClick={verifyCode}
                                                        >
                                                            Submit
                                                        </button>
                                                    </Dialog.Content>
                                                </Dialog.Portal>
                                            </Dialog.Root>
                                            <p>
                                                Status:{" "}
                                                {user.preferences.security
                                                    .twoFactor.active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </p>
                                        </div>
                                    </div>
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
