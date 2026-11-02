# Zhed 유사 미니멀 로직 퍼즐 게임 시장 레퍼런스 분석

## 1. Zhed란?

**Zhed**는 Ground Control Studios가 개발한 미니멀 로직 퍼즐 게임이다.  
핵심 메커닉: 그리드 위의 숫자 타일을 탭하고 방향을 선택하면 해당 숫자만큼 경로가 채워지며, 목표 칸(goal square)을 정확히 채우면 레벨 클리어.

- 타이머 없음, 별점 없음, 트릭 없음 — 순수 퍼즐만 존재
- 무료 + 힌트 구매 / 추가 레벨팩 IAP 구조
- iOS, Android, Steam, Nintendo Switch 출시

---

## 2. 시장 개요: 퍼즐 게임 현황 (2024~2025)

| 지표 | 수치 |
|------|------|
| 2024년 모바일 퍼즐 게임 다운로드 | **75.3억 건** (+10.4% YoY) |
| 2024년 모바일 퍼즐 게임 매출 | **60.5억 달러** (+48.9% YoY) |
| 2025년 퍼즐 장르 매출 | **82억 달러** 돌파 (+7.6% YoY) |
| 퍼즐 게임 광고 비중 (Android) | 전체 광고의 **25%** |
| 퍼즐 게임 평균 ARPDAU | $0.08 |

퍼즐 장르는 2025년에도 캐주얼 시장 내 유일하게 지속 성장한 장르이며, 다운로드와 매출 모두 증가세다.

---

## 3. 주요 레퍼런스 게임 분석

### 3-1. Flow Free (Big Duck Games, 2012~현재)
- **메커닉**: 같은 색 점을 파이프로 연결하고 격자 전체를 채우는 넘버링크 퍼즐
- **특징**: 직관적인 터치 조작, 격자 크기 다양화, 실행취소 버튼
- **성과**: 출시 이후 누적 **1억 회 이상** 다운로드 (2022년 기준), 다양한 확장 버전(Bridges, Shapes 등) 출시
- **수익 모델**: 무료 + 광고 제거 유료 / 추가 팩 IAP
- **Zhed와의 공통점**: 그리드 기반, 경로 채우기, 단순 입력 → 깊은 퍼즐

---

### 3-2. Klocki (Rainbow Train)
- **메커닉**: 타일을 회전시켜 모든 선을 연결하는 라인 연결 퍼즐
- **특징**: Apple 에디터 추천 선정, 미니멀한 3D 아이소메트릭 비주얼, 차분한 사운드트랙
- **성과**: Apple 공식 추천 반복 선정 → 소규모 인디 스튜디오의 성공 사례
- **수익 모델**: 유료 프리미엄 (일회성 구매)
- **Zhed와의 공통점**: 미니멀 비주얼, 차분한 분위기, 무광고 철학

---

### 3-3. hocus. (Abstracta)
- **메커닉**: 불가능한 에셔 스타일 기하학 구조에서 큐브를 목표 지점까지 이동
- **특징**: Google Play 최고 평점 퍼즐 게임 중 하나, 100개 레벨 + 유저 레벨 에디터
- **성과**: 앱스토어/플레이스토어 상위 퍼즐 랭킹 유지
- **수익 모델**: 무료 + IAP / 유료 레벨팩
- **Zhed와의 공통점**: 추상적 비주얼, 순수 로직 퍼즐, 힌트 시스템

---

### 3-4. Infinity Loop (Balysv)
- **메커닉**: 루프 패턴이 완성되도록 파이프 조각을 회전
- **특징**: 완전 무료, 광고 기반, 무한 레벨 생성
- **성과**: 구글 플레이 5백만+ 다운로드, 높은 리텐션의 명상형 게임
- **수익 모델**: 무료 + 광고 (리워드 광고)
- **Zhed와의 공통점**: 단순한 한 가지 메커닉, 명상/릴렉스 경험 제공

---

### 3-5. Rop (Philipp Stollenmayer)
- **메커닉**: 헥사 그리드 위에서 겹치는 밴드를 배열해 목표 모양과 매칭
- **특징**: 루베리한(rubbery) 물리 피드백, 198개 마인드벤딩 레벨, 점진적 학습 곡선
- **성과**: 인디 퍼즐 커뮤니티에서 높은 평가, App Store 피처링
- **수익 모델**: 유료 프리미엄
- **Zhed와의 공통점**: 비선형 직관적 메커닉, 점진적 난이도 증가

---

### 3-6. Monument Valley 시리즈 (ustwo games)
- **메커닉**: 에셔 스타일 불가능 구조물을 조작해 주인공을 이동시키는 퍼스펙티브 퍼즐
- **특징**: 영화적 비주얼, 이야기 요소, 높은 제작 퀄리티
- **성과**: iOS 최고 매출 퍼즐 게임 중 하나, Apple 디자인 어워드 수상, 넷플릭스 드라마 영감
- **수익 모델**: 유료 프리미엄 ($3.99~$4.99)
- **Zhed와의 차이점**: 내러티브 중심, 높은 제작비 — 순수 미니멀 로직은 아님

---

### 3-7. Unpuzzle / Unpuzzle 3D (TapTap Games)
- **메커닉**: 3D 블록을 순서대로 탭해 하나씩 제거하는 퍼즐
- **특징**: 부드럽고 만족스러운 블록 해체 피드백, 여러 버전 존재
- **성과**: 앱스토어/플레이스토어 다수 버전 출시, 광고 기반 무료 게임
- **수익 모델**: 무료 + 리워드 광고 + IAP
- **Zhed와의 공통점**: 단계적 논리 해결, 최소한의 UI

---

### 3-8. 1010! Block Puzzle (Gram Games)
- **메커닉**: 테트리스형 블록을 그리드에 놓아 줄을 지우는 캐주얼 퍼즐
- **특징**: 2024년 DAU 1,400만 달성, 일일 챌린지 + 소셜 경쟁
- **성과**: 수억 다운로드, 장기간 탑 차트 유지
- **수익 모델**: 무료 + 광고 + IAP
- **Zhed와의 차이점**: 스코어 기반 무한 플레이, 경쟁 요소 존재

---

### 3-9. Good Sudoku (Zach Gage)
- **메커닉**: AI 기반 힌트 시스템을 탑재한 프리미엄 수도쿠
- **특징**: 직관적 UX 혁신, 인디 개발자의 퀄리티 프리미엄 노선 대표작
- **성과**: 인디 퍼즐 게임 수익화의 모범 사례로 언급
- **수익 모델**: 유료 프리미엄
- **Zhed와의 공통점**: 반광고 철학, 순수 로직 집중

---

## 4. 시장 트렌드 분석

### 4-1. 하이퍼캐주얼 → 하이브리드캐주얼 전환
2024~2025년 시장의 가장 큰 흐름은 **순수 하이퍼캐주얼에서 하이브리드캐주얼로의 이동**이다.
- 순수 하이퍼캐주얼: 광고 수익만으로는 LTV 지탱 어려움
- 하이브리드캐주얼: 단순 핵심 메커닉 + 메타게임(수집, 빌딩, 진행도, 내러티브) 결합
- Q1 2025: 하이브리드캐주얼 IAP 매출 3억 4,500만 달러 (H1 2025)

### 4-2. 미니멀 퍼즐의 재부상
- "노이즈 없는 경험"을 원하는 플레이어 수요 증가
- 타이머 없음, 별점 없음, 스트레스 없는 순수 퍼즐이 핵심 가치
- Gen Z(18~34세) 주도, 여성 비율 높음

### 4-3. 수익화 모델 비교

| 모델 | 예시 | 장점 | 단점 |
|------|------|------|------|
| 유료 프리미엄 | Klocki, Rop, Monument Valley | 깨끗한 경험, 팬덤 형성 | 다운로드 장벽 높음 |
| 무료 + 광고 | Infinity Loop, 1010! | 빠른 유저 확보 | 광고 경험 저하 |
| 무료 + IAP | Zhed, hocus | 넓은 유입 + 수익화 균형 | 설계 복잡 |
| 하이브리드 | 대부분 2025 신작 | LTV 극대화 | 가장 복잡한 설계 |

캐주얼 퍼즐 평균: IAP 40~60% / 광고 40~60% 비율이 최적으로 알려짐

---

## 5. Zhed류 게임의 성공 요인 정리

1. **단일 핵심 메커닉의 깊이**: 배우기 쉽지만 마스터하기 어려운 구조
2. **점진적 난이도 설계**: 튜토리얼 없이 플레이로 학습 유도
3. **마찰 제거 UX**: 실행취소, 레벨 리셋, 부드러운 조작 피드백
4. **미니멀 비주얼 + 차분한 사운드**: 명상적 경험 제공
5. **반광고 철학 또는 비침습적 수익화**: 유저 신뢰 구축
6. **멀티 플랫폼 출시**: iOS + Android + Steam으로 팬층 확장
7. **큐레이션된 레벨 설계**: 무한 생성보다 정성껏 만든 유한 레벨이 평판에 유리

---

## 6. 경쟁 포지셔닝 시사점

Zhed 유사 게임을 새로 만든다면 다음 차별화 지점을 고려할 것:

- **독창적 물리/메커닉 법칙**: 단순히 '그리드 채우기'를 벗어나 고유한 규칙 1~2개 추가
- **레벨 에디터 + 공유**: hocus가 증명한 커뮤니티 기반 롱테일 전략
- **하이브리드 수익화**: 완전 무료 + 광고 제거 구독($1.99/월) + 힌트 IAP 조합
- **멀티플랫폼 데이원**: iOS/Android 동시 출시 + Steam Deck 대응
- **접근성 배려**: 컬러블라인드 모드, 큰 타일 옵션 → 리뷰 평점 상승 요인

---

## Sources

- [Games Like ZHED - Puzzle Game For Android - MoreAppsLike](https://moreappslike.com/app/com.groundcontrol.zhed)
- [60+ Games Like ZHED - Puzzle Game - MiniReview](https://minireview.io/puzzle/zhed-puzzle-game/games-like)
- [ZHED - Ground Control Studios](https://gcontrolgames.com/zhed/)
- [ZHED - Puzzle Game on Steam](https://store.steampowered.com/app/543040/ZHED__Puzzle_Game/)
- [Flow Free - Wikipedia](https://en.wikipedia.org/wiki/Flow_Free)
- [Games similar to Flow Free - Thinky Games](https://thinkygames.com/games/flow-free/similar/)
- [Infinity Loop: Relaxing Puzzle - App Store](https://apps.apple.com/us/app/infinity-loop-relaxing-puzzle/id977028266)
- [hocus. App - App Store](https://apps.apple.com/us/app/hocus/id1030548464)
- [Klocki - AppBrain](https://www.appbrain.com/app/klocki/com.klockigame.klocki)
- [rop - App Store](https://apps.apple.com/us/app/rop/id970421850)
- [10 Best Puzzle Mobile Games to Play in 2025 - FoxData](https://foxdata.com/en/blogs/10-best-puzzle-mobile-games-to-play-in-2025/)
- [Puzzle Mobile Games in 2025: Market Overview - FoxData](https://foxdata.com/en/blogs/puzzle-mobile-games-in-2025-market-overview-user-acquisition-strategies/)
- [Casual Games Report H1 2025 - AppMagic](https://appmagic.rocks/research/casual-report-h1-2025)
- [Top 10 Hybridcasual Games in Q1 2025 - Gamigion](https://www.gamigion.com/top-10-hybridcasual-games-in-q1-2025-the-great-puzzle-takeover/)
- [Mobile Gaming Market 2025: Trends - ASOMobile](https://asomobile.net/en/blog/mobile-gaming-market-2025-trends-and-forecasts/)
- [Why Some Puzzle Games are More Addicting - Deconstructor of Fun](https://www.deconstructoroffun.com/blog/2025/2/3/hybridcasual-puzzles-expanding-the-puzzle-market)
- [Game Monetization For Puzzle Games - Meegle](https://www.meegle.com/en_us/topics/game-monetization/game-monetization-for-puzzle-games)
- [Minimalist Puzzle Games Are The Future Of Mobile Gaming - Gadget Rumours](https://www.gadget-rumours.com/minimalist-puzzle-games-are-the-future-of-mobile-gaming/)
- [Best Mobile Puzzle Games That Actually Make You Think - Udonis](https://www.blog.udonis.co/mobile-marketing/mobile-games/top-puzzle-games)
- [Good Sudoku](https://playgoodsudoku.com/)
