import { QuickDB } from "quick.db";
import path from "path";
import chalk from "chalk";

import { launchArgs } from "..";

let db: any;

try {
    // Start the database
    let dbPath = launchArgs.dev == true ? "../../data/db.sqlite" : "../../../data/db.sqlite";
    db = new QuickDB({ filePath: path.join(__dirname, dbPath) });

    console.log(`${chalk.magenta("event")} - Database connected and ready to use`);
} catch (err) {
    console.log(`${chalk.redBright("error")} - There was an error connecting to the database`);
    console.log(err);
}

export default db;
