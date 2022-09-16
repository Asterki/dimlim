import chalk from "chalk";
import { app } from "../index";

try {
    app.use("/api/content", require("../api/content"));
    app.use("/api/accounts", require("../api/accounts"));
    app.use("/api/users", require("../api/users"));
    app.use("/api/upload", require("../api/upload"));

    console.log(`${chalk.cyanBright("info ")} - Routes loaded`);
} catch (err) {
    console.log(`${chalk.redBright("error ")} - There was an error loading the routes`);
    console.log(err);
}

export { app };
