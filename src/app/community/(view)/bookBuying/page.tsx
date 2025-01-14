import Pagination from '@/components/community/view/Pagination';
import { BookBuyingDataType } from '@/types/community/view/data';
import dynamic from 'next/dynamic';
import BookContentSkeletonUi from '@/components/common/BookContentSkeletonUi';
async function fetchData() {
	let retryCount = 0;
	const maxRetries = 3;

	while (retryCount < maxRetries) {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/community/bookBuying`,

				{
					cache: 'no-store',
				},
			);
			if (response.ok) {
				const data = await response.json();
				return data;
			} else {
				throw new Error(
					`Fetch request failed with status code ${response.status}`,
				);
			}
		} catch (error) {
			console.error(
				`Fetch request failed. Retrying... (Attempt ${retryCount + 1}/${maxRetries})`,
				error,
			);
			retryCount++;
			await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 대기 후 재시도
		}
	}

	throw new Error('Maximum number of retries reached. Unable to fetch data.');
}
function isBookBuyingArray(data: any): data is BookBuyingDataType[] {
	return (
		Array.isArray(data) &&
		data.every(
			(item) =>
				typeof item === 'object' &&
				'title' in item &&
				'created_at' in item &&
				'view' in item &&
				'like' in item &&
				'user_name' in item &&
				'content' in item &&
				'field' in item &&
				'content_img_url' in item &&
				'state' in item &&
				'book_name' in item &&
				'book_img_url' in item &&
				'category' in item &&
				'price' in item &&
				'book_id' in item &&
				'like_users' in item,
		)
	);
}
const BuyingContentBoxLazy = dynamic(
	() => import('@/components/community/view/BuyingContentBox'),
	{ loading: () => <BookContentSkeletonUi /> },
);
export default async function bookBuying({
	searchParams,
}: {
	searchParams: {
		sort?: string;
		q?: string;
		num?: string;
		categories?: string;
	};
}) {
	const data: BookBuyingDataType[] = await fetchData();

	if (!isBookBuyingArray(data)) {
		throw new Error('Data is not an array of book buying ');
	}
	const queryFiltering = searchParams?.q
		? data.filter((report: BookBuyingDataType) =>
				report.title.includes(searchParams.q as string),
			)
		: data;
	const categoryFiltering = queryFiltering.filter(
		(report: BookBuyingDataType) => {
			switch (searchParams?.categories) {
				case 'true':
					return report.state === false;
				case 'false':
					return report.state === true;
				default:
					return report;
			}
		},
	);
	const sortFiltering = categoryFiltering.sort(
		(a: BookBuyingDataType, b: BookBuyingDataType) => {
			switch (searchParams?.sort) {
				case 'Latest':
					return b.created_at > a.created_at ? 1 : -1;
				case 'Oldest':
					return a.created_at > b.created_at ? 1 : -1;
				case 'View':
					return b.view - a.view;
				default:
					return b.created_at > a.created_at ? 1 : -1;
			}
		},
	);
	const num = searchParams?.num ? parseInt(searchParams.num) : 1;

	const start = num * 10 - 10;
	const end = num * 10 - 1;

	const numFiltering = sortFiltering.slice(start, end);
	return (
		<section>
			{numFiltering?.map((data: BookBuyingDataType) => {
				return (
					<BuyingContentBoxLazy
						key={data.doc_id as string}
						data={data}
						page="bookBuying"
					/>
				);
			})}
			<Pagination length={data.length} show_page_num={10} />
		</section>
	);
}
