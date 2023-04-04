import chalk from "chalk";
import { app } from "../index";

try {
    require("./middleware/app")
    // require("./middleware/helmet")
    console.log(`${chalk.cyanBright("info ")} - Middleware loaded`);

    app.use("/api/accounts", require("./api/accounts"))
    app.use("/api/messages", require("./api/messages"))
    app.use("/api/upload", require("./api/upload"))
    app.use("/api/users", require("./api/users"))
    console.log(`${chalk.cyanBright("info ")} - Routes loaded`);
} catch (err: unknown) {
    console.log(`${chalk.redBright("error ")} - There was an error loading the routes`);
    console.log(err);
}

export { app };
