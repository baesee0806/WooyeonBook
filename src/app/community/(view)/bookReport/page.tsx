import BookContentSkeletonUi from '@/components/common/BookContentSkeletonUi';
import Pagination from '@/components/community/view/Pagination';
import { BookReportDataType } from '@/types/community/view/data';
import dynamic from 'next/dynamic';
async function fetchData() {
	let retryCount = 0;
	const maxRetries = 3;

	while (retryCount < maxRetries) {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/community/bookReport`,

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
function isBookReportArray(data: any): data is BookReportDataType[] {
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
				'book_name' in item &&
				'book_img_url' in item &&
				'category' in item &&
				'content_img_url' in item &&
				'doc_id' in item &&
				'field' in item &&
				'book_id' in item &&
				'created_user' in item,
		)
	);
}
const ReportContentBoxLazy = dynamic(
	() => import('@/components/community/view/ReportContentBox'),
	{ loading: () => <BookContentSkeletonUi /> },
);
async function bookReport({
	searchParams,
}: {
	searchParams: {
		sort?: string;
		q?: string;
		num?: string;
		categories?: string;
	};
}) {
	const data: BookReportDataType[] = await fetchData();

	if (!isBookReportArray(data)) {
		throw new Error('Data is not an array of book reports');
	}

	const queryFiltering = searchParams?.q
		? data.filter((report: BookReportDataType) =>
				report.title.includes(searchParams.q as string),
			)
		: data;

	const sortFiltering = queryFiltering.sort(
		(a: BookReportDataType, b: BookReportDataType) => {
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
			{numFiltering?.map((data: BookReportDataType) => {
				return (
					<ReportContentBoxLazy
						key={data.doc_id as string}
						data={data}
						page="bookReport"
					/>
				);
			})}
			<Pagination length={data.length} show_page_num={10} />
		</section>
	);
}

export default bookReport;
