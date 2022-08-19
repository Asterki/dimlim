import levelUp from "levelup";
import levelDown from "leveldown";

import path from "path";
import chalk from "chalk";

let db: any;

try {
    db = levelUp(levelDown(path.join(__dirname, "../../data/db")));

    db.on("ready", () => {
        console.log(`${chalk.magenta("event")} - Database connected and ready to use`);
    });
} catch (err) {
    console.log(`${chalk.redBright("error")} - There was an error connecting to the database`);
    console.log(err);
}

export default db;
