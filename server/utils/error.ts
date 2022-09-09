import fs from "fs";
import chalk from "chalk";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const reportError = (errorToLog: any) => {
    // Generate the error ID
    let errorID = uuidv4();

    // Get the logs in the file
    fs.readFile(path.join(__dirname, "../logs/errors.log"), (err: any, content: any) => {
        if (err) throw err;

        // Write new log
        fs.writeFile(
            path.join(__dirname, "../logs/errors.log"),
            `${content}Error Reported at ${new Date()}\nError ID: ${errorID}\n${errorToLog.stack}\n\n`,
            (err: any) => {
                if (err) throw err;
                console.log(`${chalk.red("error")} - New error, error ID: ${errorID}`);
            }
        );
    });

    return errorID;
};

export { reportError };
