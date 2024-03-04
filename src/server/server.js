const express = require('express');
const axios = require('axios');
const cors = require('cors');

const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 8080;

require('dotenv').config();
app.use(cors({ origin: true, credentials: true }));

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY,
);

// 책 검색 api

app.get('/search/book', async (req, res) => {
	const { bookName } = req.query;
	try {
		const data = await axios.get(
			`${process.env.ALADIN_URL}?ttbkey=${process.env.ALADIN_TTBKEY}&SearchTarget=Book&output=js&Version=20131101&Query=${bookName}`,
		);
		res.status(200).send(data.data.item);
	} catch (err) {
		res.status(400).send(err);
	}
});

// 커뮤니티

app.get('/api/community/bookReport/:docid', async (req, res) => {
	try {
		const { data, error } = await supabase
			.from('bookReport')
			.select('*')
			.eq('docid', req.params.docid);
		if (error) {
			throw error;
		}
		res.status(200).send(data[0]);
	} catch (err) {
		res.status(400).send;
	}
});
