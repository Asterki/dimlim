import mongoose from "mongoose";

class MongoDBClient {
    connectionString: string;

    constructor(connectionString: string) {
        this.connectionString = connectionString
    }

    private onError(error: Error) {
        console.error(`There was an error trying to connect to MongoDB`);
        console.error(error);
    }

    private onConnect() {
        console.log(`MongoDB database connected`);
    }

    private connect() {
        mongoose.set("strictQuery", true);
        mongoose.connect(
            this.connectionString,
            {
                useUnifiedTopology: true,
                useNewUrlParser: true,
            } as mongoose.ConnectOptions
        );

        const mongooseClient = mongoose.connection;
        mongooseClient.once("open", this.onConnect);
        mongooseClient.once("error", this.onError);
    }

    public getClient() {
        return mongoose.connection;
    }
}

export default MongoDBClient;