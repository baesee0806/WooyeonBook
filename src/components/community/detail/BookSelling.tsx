import { AllDataType } from '@/types/community/view/data';
import styles from '@/styles/community/detail/detailPage.module.css';
import dynamic from 'next/dynamic';
import { getDate } from '@/utils/getDate';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import CommentCreate from './comment/CommentCreate';
import CommentItem from './comment/CommentItem';
import { fetchComments } from '@/apis/community/fetchComments';
import { CommentData } from '@/types/community/comment';
import StateBtn from './StateBtn';
import LikeBtn from './LikeBtn';
import Image from 'next/image';
import DropDownBtn from './DropDownBtn';
import shareIcon from '@/assets/community/shareIcon.png';

interface BookSellingProps {
	data: AllDataType;
	params: { doc_id: string };
	searchParams?: { sort?: string };
	page: string;
}
const View = dynamic(() => import('@/components/common/Viewer'), {
	ssr: false,
});

const BookSelling = async ({
	searchParams,
	data,
	page,
	params,
}: BookSellingProps) => {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	const comments: CommentData[] = await fetchComments(data.doc_id);
	// 댓글 좋아요, 최신순
	// const sortedComments = comments.sort((a: CommentData, b: CommentData) => {
	// 	switch (searchParams?.sort) {
	// 		case 'like':
	// 			return b.like - a.like;
	// 		case 'lastest':
	// 			return (
	// 				new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	// 			);
	// 		default:
	// 			return (
	// 				new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	// 			);
	// 	}
	// });

	return (
		<section className={styles.container}>
			<section className={styles.optionContainer}>
				<h2 className={styles.title}>{data.title}</h2>
				{/* 날짜,조회수,좋아요 */}
				<div className={styles.optionItemWrap}>
					<div className={styles.infoWrap}>
						<div className={styles.contentInfoWrap}>
							<div>{getDate(data.created_at)}</div>
							<div className={styles.dot}>･</div>
							<div>조회수{data.view}</div>
							<div className={styles.dot}>･</div>
							<div>좋아요{data.like_users.length} </div>
						</div>
					</div>
				</div>
			</section>

			{/* 모임 내용 */}
			<div className={styles.OptionaccordionContainer}>
				<section className={styles.optionMeetingContainer}>
					<div className={styles.optionItemWrap}>
						<label className={styles.optionItemTitle}>판매 / 나눔</label>
						<div className={styles.optionItemContent}>
							{data.selling ? '판매' : '나눔'}
						</div>
					</div>
					<div className={styles.optionItemWrap}>
						<label className={styles.optionItemTitle}>판매하는 책</label>
						<div className={styles.optionItemContent}>{data.book_name}</div>
					</div>
					<div className={styles.optionItemWrap}>
						<label className={styles.optionItemTitle}>희망 판매 가격</label>
						<div className={styles.optionItemContent}>{data.price} 원</div>
					</div>
				</section>
				<View content={data.content} />
			</div>

			{/* 책 내용 */}
			<div className={styles.viewerWrap}>
				<div className={styles.viewBtnWrap}>
					<StateBtn
						page={'bookSelling'}
						doc_id={params.doc_id}
						state={data.state as boolean}
						admin={data.created_user}
						selling={data.selling}
					/>
					<LikeBtn
						page={'bookSelling'}
						doc_id={params.doc_id}
						like={data.like_users}
					/>
					<div className={styles.shareBtnWrap}>
						<button className={styles.shareBtn}>
							<Image
								src={shareIcon}
								alt="shareIcon"
								width={15}
								height={15}
								className={styles.iconsStyle}
							/>
							<span className={styles.shareText}>공유</span>
						</button>
					</div>
					<DropDownBtn data={data} user={user} page="bookSelling" />
				</div>
			</div>
			{/* 댓글 */}
			<section className={styles.commentWrapper}>
				<div className={styles.commentHeader}>
					<div className={styles.commentCount}>댓글 </div>
					<span className={styles.commentCountLength}>{comments.length}</span>
					<div className={styles.commentSortWrap}></div>
				</div>
				<CommentCreate page={'bookReport'} doc_id={data.doc_id} />
				<ul>
					{comments.map((item) => {
						return <CommentItem data={item} key={item.id} />;
					})}
				</ul>
			</section>
		</section>
	);
};

export default BookSelling;
