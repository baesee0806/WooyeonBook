import styles from '@/styles/shoppingCart/shoppingCartPage.module.css';
import Image from 'next/image';
import bookImg from '../../../public/book.png';
export default function shoppingCartPage() {
	return (
		<div className={styles.container}>
			<header>
				<h1>장바구니</h1>
			</header>
			<div>
				<hr />
				<div className={styles.cartHeader}>
					<input type="checkbox" />
					<div>상품 정보</div>
					<div>정가</div>
					<div>판매가</div>
					<div>수량</div>
					<div>합계</div>
				</div>
				<hr />
				<div className={styles.cartBody}>
					<input className={styles.cartBodyCheckbox} type="checkbox" />
					<div className={styles.itemInfoWrap}>
						<Image src={bookImg} alt="" width={155} height={200} />
						<div>
							<div className={styles.itemName}>상품명</div>
							<div className={styles.itemWriter}>글쓴이</div>
							<div className={styles.itemTranslator}>옮긴이</div>
						</div>
					</div>
					<div className={styles.cartBodyPrice}>정가</div>
					<div className={styles.cartBodySellingPrice}>판매가</div>
					<div className={styles.quantityWrap}>
						<button className={styles.quantityMinusPlusBtn}>-</button>
						<div className={styles.quantity}>0</div>
						<button className={styles.quantityMinusPlusBtn}>+</button>
					</div>
					<div className={styles.cartBodySumPrice}>합계</div>
				</div>
				<hr />
			</div>
		</div>
	);
}
