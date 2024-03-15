import 'dotenv/config'

import Server from "./controllers/server";
import MongoDBClient from "./controllers/mongodb"

const dev = process.env.NODE_ENV !== "production";
const server = new Server(dev, 3000);

const mongoClient = new MongoDBClient(process.env.MONGODB_URI as string);
mongoClient.getClient();

server.start();

export default server;
