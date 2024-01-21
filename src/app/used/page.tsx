import BookItemWrapper from '@/components/common/BookItemWrapper';
import Category from '@/components/common/Category';
import Pageheader from '@/components/common/PageHeader';
import Pagination from '@/components/common/Pagination';
import Sort from '@/components/common/Sort';
import styles from '@/styles/used/used.module.css';

export default function usedPage() {
	return (
		<>
			<Pageheader title="중고도서" />
			<div className={styles.container}>
				<div className={styles.wrapper}>
					<Category />
					<Sort />
					<BookItemWrapper />
					<Pagination />
				</div>
			</div>
		</>
	);
}