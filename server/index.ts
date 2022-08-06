import express from 'express';
import minimist from 'minimist';
import next from 'next';
import chalk from 'chalk';
import path from 'path';

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
let launchArgs = minimist(process.argv.slice(2), {
	string: ['dev', 'port'],

	default: {
		dev: process.env.NODE_ENV !== 'production' || true,
		port: process.env.PORT || 8080,
	},
});

const app = express();
const nextApp = next({ dev: launchArgs.dev });

nextApp.prepare().then(() => {
	const handle = nextApp.getRequestHandler();

	require('./config/middleware');
	require('./config/routes');

	app.get('*', (req, res) => {
		handle(req, res);
	});

	app.listen(launchArgs.port, () => {
		console.log(`${chalk.magenta('event')} - Server running at ${launchArgs.port}`);
	});
});

export { app, nextApp };
