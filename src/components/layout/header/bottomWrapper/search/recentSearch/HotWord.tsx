import styles from '@/styles/layout/header/bottomWrapper/search/recentSearch/hotWord.module.css';
import Image from 'next/image';
import lineIcon from '@/assets/layout/lineIcon.png';
import { useRouter } from 'next/navigation';
import { useSetRecoilState } from 'recoil';
import { currentPageAtom } from '@/recoil/atom/currentPageAtom';
import { useQuery } from '@tanstack/react-query';
import useKeyWordsQuery from '@/hooks/useKeyWordsQuery';

interface popularKeywords {
	id: string;
	keyword: string | number | Date;
	search_count: string;
	created_at: Date;
}
export default function HotWord() {
	// useRouter 호출
	const router = useRouter();
	// 현재 인기 검색어 페이지 리코일
	const setCurrentPage = useSetRecoilState(currentPageAtom);

	// const { data, error, isLoading } = useQuery<popularKeywords[]>({
	// 	queryKey: ['oldHotWords'],
	// 	queryFn: () =>
	// 		fetch(
	// 			`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/search/supabase/keywords`,
	// 		).then((res) => res.json()),
	// 	refetchOnWindowFocus: false,
	// });
	const {
		getHotwordsData: { isLoading, error, data },
	} = useKeyWordsQuery();

	console.log('확인', data);
	if (error) return <div> There was an error!</div>;
	if (isLoading) return <div> Data is Loading...</div>;

	// const [popularSearchData, setPopularSearchData] = useState<popularKeywords[]>(
	// 	[],
	// );

	// // 검색어 api
	// useEffect(() => {
	// 	const fetchKeywords = async () => {
	// 		const response = await fetch(
	// 			`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/search/supabase/keywords`,
	// 		);
	// 		const data: popularKeywords[] = await response.json();
	// 		setPopularSearchData(data);
	// 	};
	// 	fetchKeywords();
	// }, []);

	//현재 년도 날짜 함수
	const today = new Date();
	let year = today.getFullYear();
	let month = ('0' + (today.getMonth() + 1)).slice(-2);
	let day = ('0' + today.getDate()).slice(-2);
	const dateString = year + '-' + month + '-' + day;

	// 인기 검색어 클릭 시 동작하는 함수
	const handleValueClick = (value: string) => {
		router.push(`/search?keyword=${value}&pageNum=1`);
		// 1페이지로&제목순으로 초기화
		setCurrentPage(1);
	};
	return (
		<dl className={styles.hotWordWrapper}>
			<dt className={styles.hotWordTxt}>
				인기 검색어
				<span className={styles.hotWordDate}>{dateString}</span>
			</dt>
			<dd>
				<ol className={styles.hotWordPopularWrap}>
					{data?.map((hotword: any, index: any) => {
						return (
							<li className={styles.hotWordPopularLi} key={index}>
								<span
									className={styles.hotWordLink}
									onMouseDown={() => {
										handleValueClick(hotword.keyword as string);
									}}>
									<span className={styles.hotWordNum}>{index + 1}</span>
									<span className={styles.hotWordTitle}>
										{hotword.keyword as string}
									</span>
									<Image
										src={lineIcon}
										alt="lineIcon"
										className={styles.lineIcon}
										width={15}
										height={2}
									/>
								</span>
							</li>
						);
					})}
				</ol>
			</dd>
		</dl>
	);
}
