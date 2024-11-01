import mongoose from 'mongoose';

import Logger from '../utils/logger';

class MongoDBClient {
  connectionString: string;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
    this.connect();
  }

  connect() {
    mongoose.set('strictQuery', true);
    mongoose.connect(this.connectionString, {} as mongoose.ConnectOptions);

    const mongooseClient = mongoose.connection;
    mongooseClient.once('open', this.onConnect);
    mongooseClient.once('error', this.onError);
  }

  public getClient() {
    return mongoose.connection;
  }

  private onError(error: Error) {
    Logger.error(`MongoDB connection error: ${error.message}`);
  }

  private onConnect() {
    Logger.info('MongoDB connected');
  }
}

export default MongoDBClient;
