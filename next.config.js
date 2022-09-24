/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,

    distDir: "build/src",

    async rewrites() {
        return [
            // Main
            {
                source: "/home",
                destination: "/main/home",
            },
            {
                source: "/",
                destination: "/main",
            },
            {
                source: "/error",
                destination: "/main/error",
            },

            // Accounts
            {
                source: "/login",
                destination: "/accounts/login",
            },
            {
                source: "/register",
                destination: "/accounts/register",
            },
            {
                source: "/settings",
                destination: "/accounts/settings",
            },
        ];
    },
};

module.exports = nextConfig;
