const express = require('express');
const axios = require('axios');
const cors = require('cors');

const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 8080;
require('dotenv').config();

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
			`http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=ttbkjhhj991430001&SearchTarget=Book&output=js&Version=20131101&Query=${bookName}`,
		);
		res.status(200).send(data.data.item);
	} catch (err) {
		res.status(400).send(err);
	}
});

app.get('/search/keyword', async (req, res) => {
	const { keyword } = req.query;
	try {
		const data = await axios.get(
			`http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${process.env.TTB_KEY}&Query=${keyword}&SearchTarget=All&output=js&Version=20131101`,
		);
		res.status(200).send(data.data.item);
	} catch (err) {
		res.status(400).send(err);
	}
});

// 커뮤니티 update api

app.get('/api/community/bookReport/:docid', async (req, res) => {
	try {
		const { data, error } = await supabase
			.from('bookReport')
			.select('*')
			.eq('doc_id', req.params.docid);
		if (error) {
			throw error;
		}
		res.status(200).send(data[0]);
	} catch (err) {
		res.status(400).send;
	}
});

app.get('/api/community/bookMeeting/:docid', async (req, res) => {
	try {
		const { data, error } = await supabase
			.from('bookMeeting')
			.select('*')
			.eq('doc_id', req.params.docid);
		if (error) {
			throw error;
		}
		res.status(200).send(data[0]);
	} catch (err) {
		res.status(400).send;
	}
});

app.get('/api/community/bookBuying/:docid', async (req, res) => {
	try {
		const { data, error } = await supabase
			.from('bookBuying')
			.select('*')
			.eq('doc_id', req.params.docid);
		if (error) {
			throw error;
		}
		res.status(200).send(data[0]);
	} catch (err) {
		res.status(400).send;
	}
});

app.get('/api/community/bookSelling/:docid', async (req, res) => {
	try {
		const { data, error } = await supabase
			.from('bookSelling')
			.select('*')
			.eq('doc_id', req.params.docid);
		if (error) {
			throw error;
		}
		res.status(200).send(data[0]);
	} catch (err) {
		res.status(400).send;
	}
});

/** 원준 api */

// // 메인 페이지: 신간 도서(6개) api
// app.get('/list/new', async (req, res) => {
// 	try {
// 		const response = await axios.get(
// 			`http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=ttbkjhhj991430001&QueryType=ItemNewSpecial&MaxResults=50&start=1&SearchTarget=Book&output=js&Version=20131101&Cover=Big`,
// 		);

// 		// 신간리스트의 item만 추출해 data에 할당
// 		const data = await response.data.item
// 			// 소설/시/희곡 키워드가 포함된 아이템만 필터링
// 			.filter((item) => item.categoryName.includes('소설/시/희곡'))
// 			// 앞에서 6개만 추출
// 			.slice(0, 6);

// 		res.status(200).send(data);
// 	} catch (err) {
// 		res.status(400).send(err);
// 	}
// });

// // 메인 페이지: 베스트셀러(5개) api
// app.get('/list/best', async (req, res) => {
// 	try {
// 		const response = await axios.get(
// 			`http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=ttbkjhhj991430001&QueryType=Bestseller&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101&Cover=Big`,
// 		);

// 		// 베스트셀러의 item만 추출해 data에 할당
// 		const data = await response.data.item
// 			// 베스트셀러 item을 rank 낮은순 소팅
// 			.sort((a, b) => a.bestRank - b.bestRank)
// 			// 앞에서 5개만 추출
// 			.slice(0, 5);

// 		res.status(200).send(data);
// 	} catch (err) {
// 		res.status(400).send(err);
// 	}
// });

// new 페이지: 전체 신간 도서 api
app.get('/list/newSpecialAll', async (req, res) => {
	// request.query 내 categoryId 추출
	const { categoryId, page } = req.query;
	// 추출한 page를 숫자로 변환(문자열로 넘어옴)해서 startIndex에 삽입(아이템 뿌려주는 시작 숫자)
	const start = Number(page);

	try {
		const response = await axios.get(
			`${process.env.NEXT_PUBLIC_BASE_URL}?ttbkey=${process.env.NEXT_PUBLIC_TTB_KEY}&QueryType=ItemNewSpecial&MaxResults=30&start=${start}&SearchTarget=Book&CategoryId=${categoryId}&output=js&Version=20131101&Cover=Big`,
		);

		// 신간리스트의 해당 카테고리 item만 추출해 data에 할당
		const data = await response.data.item.filter(
			// 책 제목 필터링
			(item) => !item.title.includes('큰글자책', '빅북', '세트'),
		);
		// 해당 카테고리 item의 총 갯수 (약 1,700여 개(3/9 기준))
		const dataLength = await response.data.totalResults;
		res.status(200).send({ data, dataLength });
	} catch (err) {
		res.status(400).send(err);
	}
});

// best 페이지: 전체 베스트셀러 도서 api
app.get('/list/bestAll', async (req, res) => {
	// request.query 내 categoryId 추출
	const { categoryId, page } = req.query;
	// 추출한 page를 숫자로 변환(문자열로 넘어옴)해서 startIndex에 삽입(아이템 뿌려주는 시작 숫자)
	const start = Number(page);

	try {
		const response = await axios.get(
			`${process.env.NEXT_PUBLIC_BASE_URL}?ttbkey=${process.env.NEXT_PUBLIC_TTB_KEY}&QueryType=Bestseller&MaxResults=24&start=${start}&SearchTarget=Book&CategoryId=${categoryId}&output=js&Version=20131101&Cover=Big`,
		);

		// 신간리스트의 해당 카테고리 item만 추출해 data에 할당
		const data = await response.data.item;
		// 해당 카테고리 item의 총 갯수
		const dataLength = await response.data.totalResults;

		res.status(200).send({ data, dataLength });
	} catch (err) {
		res.status(400).send(err);
	}
});

// used 페이지: 전체 중고 도서 api
app.get('/list/usedAll', async (req, res) => {
	// request.query 내 categoryId 추출
	const { categoryId, page } = req.query;
	// 추출한 page를 숫자로 변환(문자열로 넘어옴)해서 startIndex에 삽입(아이템 뿌려주는 시작 숫자)
	const start = Number(page);

	try {
		const response = await axios.get(
			`${process.env.NEXT_PUBLIC_BASE_URL}?ttbkey=${process.env.NEXT_PUBLIC_TTB_KEY}&QueryType=ItemNewAll&MaxResults=30&start=${start}&SearchTarget=Used&SubSearchTarget=Book&CategoryId=${categoryId}&output=js&Version=20131101&Cover=Big`,
		);

		// 신간리스트의 해당 카테고리 item만 추출해 data에 할당
		const data = await response.data.item;
		// 해당 카테고리 item의 총 갯수
		const dataLength = await response.data.totalResults;

		res.status(200).send({ data, dataLength });
	} catch (err) {
		res.status(400).send(err);
	}
});

// used 페이지: 중고 베스트셀러 도서(5개) api
app.get('/list/used', async (req, res) => {
	try {
		const response = await axios.get(
			`${process.env.NEXT_PUBLIC_BASE_URL}?ttbkey=${process.env.NEXT_PUBLIC_TTB_KEY}&QueryType=itemNewAll&MaxResults=50&start=1&SearchTarget=Used&SubSearchTarget=Book&output=js&Version=20131101&Cover=Big`,
		);

		// 중고도서 리스트의 item만 추출해 data에 할당
		const data = await response.data.item
			// 중고도서 리스트의 item을 salesPoint 높은순 소팅
			.sort((a, b) => b.salesPoint - a.salesPoint)
			// 앞에서 6개만 추출
			.slice(0, 5);

		res.status(200).send(data);
	} catch (err) {
		res.status(400).send(err);
	}
});

// category 페이지: 신간 전체 리스트 api
app.get('/list/newAll', async (req, res) => {
	// request.query 내 categoryId 추출
	const { categoryId, page } = req.query;
	// 추출한 page를 넘버타입으로 변환 후 startIndex에 삽입(아이템 뿌려주는 시작 숫자)
	const start = Number(page);

	try {
		const response = await axios.get(
			`${process.env.NEXT_PUBLIC_BASE_URL}?ttbkey=${process.env.NEXT_PUBLIC_TTB_KEY}&QueryType=ItemNewAll&MaxResults=24&start=${start}&SearchTarget=Book&CategoryId=${categoryId}&output=js&Version=20131101&Cover=Big`,
		);

		// 신간리스트의 해당 카테고리 item만 추출해 data에 할당
		const data = await response.data.item.filter(
			// 책 제목이 큰글자책이 있다면 제외
			(item) => !item.title.includes('큰글자'),
		);
		// 해당 카테고리 item의 총 갯수
		const dataLength = await response.data.totalResults;

		res.status(200).send({ data, dataLength });
	} catch (err) {
		res.status(400).send(err);
	}
});
