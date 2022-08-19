import express from 'express';
import { getLang } from '../utils/locale';

const router: express.Router = express.Router();

router.get('/language', (req, res) => {
	let { lang, category, page } = req.query;

	if (!lang || !category || !page) return res.status(400).send("missing-parameters");
	if (typeof lang !== 'string' || typeof page !== 'string' || typeof category !== 'string')return res.status(400).send("invalid-parameters");

	try {
		const langFile = getLang(lang)[category][page];
		return res.status(200).send(langFile);
	} catch (err) {
		return res.status(500).send('server-error');
	}
});

module.exports = router;
