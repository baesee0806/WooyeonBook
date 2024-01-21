import PageHeader from '@/components/common/PageHeader';
import Sort from '@/components/common/Sort';
import styles from '@/styles/best/best.module.css';
import Pagination from '@/components/common/Pagination';
import Category from '@/components/common/Category';
import Rank from '@/components/best/Rank';

export default function bestPage() {
	return (
		<>
			<PageHeader title="베스트셀러" />
			<div className={styles.container}>
				<div className={styles.wrapper}>
					<Category />
					<Sort />
					<Rank />
					<Pagination />
				</div>
			</div>
		</>
	);
}