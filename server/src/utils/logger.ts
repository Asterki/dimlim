import chalk from 'chalk';
import fsExtra from 'fs-extra';
import path from 'path';

class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance() {
    if (!Logger.instance) Logger.instance = new Logger();
    return Logger.instance;
  }

  public info(message: string, logToFile: boolean = false) {
    console.log(`${chalk.blue('[INFO]')} ${message}`);

    if (logToFile) {
      fsExtra.appendFileSync(path.join(__dirname, '../../logs', 'info.txt'), `[INFO] ${message}\n`);
    }
  }

  public warn(message: string, logToFile: boolean = false) {
    console.log(`${chalk.yellow('[WARN]')} ${message}`);

    if (logToFile) {
      fsExtra.appendFileSync(path.join(__dirname, '../../logs', 'warn.txt'), `[WARN] ${message}\n`);
    }
  }

  public error(message: string, logToFile: boolean = false) {
    console.log(`${chalk.red('[ERROR]')} ${message}`);

    if (logToFile) {
      fsExtra.appendFileSync(path.join(__dirname, '../../logs', 'error.txt'), `[ERROR] ${message}\n`);
    }
  }
}

export default Logger;
