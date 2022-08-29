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

            // Accounts
            {
                source: "/login",
                destination: "/accounts/login",
            },
            {
                source: "/register",
                destination: "/accounts/register",
            },
        ];
    },
};

module.exports = nextConfig;
