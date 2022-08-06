import express from 'express';
import minimist from 'minimist';
import next from 'next';
import chalk from 'chalk';

const launchArgs = minimist(process.argv.slice(2));
const port = parseInt(launchArgs.port) || 8080;
const dev = launchArgs.dev || true;

const app = express();
const nextApp = next({ dev });

nextApp.prepare().then(() => {
	const handle = nextApp.getRequestHandler();
	require('./config/middleware');
	require('./config/routes');

	app.get('*', (req, res) => {
		handle(req, res);
	});

	app.listen(port, () => {
		console.log(`${chalk.magenta('event')} - Server running at ${port}`);
	});
});

export { app, nextApp };
