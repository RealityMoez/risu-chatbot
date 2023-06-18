// vercel.config.js
module.exports = {
    rewrites: async () => [
        { source: "/api/config", destination: "/api/config.js" },
        { source: "/:path*", destination: "/public/:path*" },
    ],
};