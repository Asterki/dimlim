import Server from "./controllers/server";

const dev = process.env.NODE_ENV !== "production";
const server = new Server(dev, 3000);

server.start();

export default server;
