import "../styles/globals.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import Head from "next/head";
import SSRProvider from "react-bootstrap/SSRProvider";
import * as React from "react";

import type { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => {
    React.useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/serviceWorker.js")
                .then((reg) => console.log("Registered service worker"))
                .catch((err) => console.log("Failure: ", err));
        }
    }, []);

    return (
        <SSRProvider>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=1" />
                <meta name="theme-color" content="#5294e2" />

                {/* PWA Stuff */}
                <link rel="apple-touch-icon" href="/apple-touch-icon.png"></link>
                <link rel="manifest" href="manifest.json" />

                {/* <!-- Primary Meta Tags --> */}
                <title>DIMLIM</title>
                <meta name="title" content="DIMLIM" />
                <meta name="description" content="DIMLIM is a private chat app that offers end-to-end encryption, file transfer and much more" />

                {/* <!-- Open Graph / Facebook --> */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://dimlim.ml/" />
                <meta property="og:title" content="DIMLIM" />
                <meta property="og:description" content="DIMLIM is a private chat app that offers end-to-end encryption, file transfer and much more" />
                <meta property="og:image" content="/banner.png" />

                {/* <!-- Twitter --> */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://dimlim.ml/" />
                <meta property="twitter:title" content="DIMLIM" />
                <meta property="twitter:description" content="DIMLIM is a private chat app that offers end-to-end encryption, file transfer and much more" />
                <meta property="twitter:image" content="/banner.png" />
            </Head>
            <Component {...pageProps} />
        </SSRProvider>
    );
};

export default App;
