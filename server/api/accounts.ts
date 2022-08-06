import express from 'express';
import rateLimit from 'express-rate-limit';
import ms from 'ms';

import { app } from '../index';

app.get(
	'/register',
	rateLimit({
		windowMs: ms('1 day'),
		max: 100,
	}),
	(req, res, next) => {
		if (!req.body.email || !req.body.password || !req.body.captcha) return res.send({ status: 400, message: 'missing parameters' });
	}
);

export {};
