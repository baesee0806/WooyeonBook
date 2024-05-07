import styles from '@/styles/community/detail/detailLayout.module.css';
import { fetchDetailCommunity } from '@/apis/community/CRUD';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const BookReportLazy = dynamic(
	() => import('@/components/community/detail/BookReport'),
	{ loading: () => <LoadingSpinner /> },
);

export default async function DetailPage({
	params,
	searchParams,
}: {
	params: { doc_id: string };
	searchParams?: { sort?: string };
}) {
	const data = await fetchDetailCommunity('bookReport', params.doc_id);

	return (
		<main className={styles.container}>
			<aside></aside>
			<article className={styles.mainWrap}>
				<BookReportLazy
					data={data}
					params={params}
					searchParams={searchParams}
					page="bookReport"
				/>
			</article>
			<aside className={styles.optionWrap}></aside>
		</main>
	);
}
