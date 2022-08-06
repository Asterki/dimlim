import chalk from 'chalk';
import { app } from '../index';

app.use('/api/content', require('../api/content'));

console.log(`${chalk.cyanBright('info ')} - Routes loaded`);
export { app };
