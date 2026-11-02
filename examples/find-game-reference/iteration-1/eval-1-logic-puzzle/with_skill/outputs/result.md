# Zhed 류 미니멀 로직 퍼즐 게임 레퍼런스 분석

---

## Step 1 — 세부 장르 명확화

**Zhed란?**
Zhed는 그리드 위의 숫자 타일을 방향에 따라 확장시켜 목표 칸을 채우는 **논리 퍼즐(Logic/Grid Puzzle)** 게임이다. 타이머, 별점, 점수 경쟁 없이 순수한 풀이 과정에만 집중하는 미니멀 UX가 특징이다.

| 항목 | 내용 |
|---|---|
| 스토어 카테고리 | 퍼즐 (Puzzle) |
| **실제 세부 장르** | **미니멀 로직 퍼즐 / 그리드 논리 퍼즐** |
| 핵심 메카닉 | 숫자 타일 방향 확장 → 목표 칸 채우기 (Fill-to-Goal) |
| 타겟 플레이어 | 코어-캐주얼 혼합 (생각하기 좋아하는 성인) |
| 플랫폼 | 모바일 주력 (iOS/Android), Steam 보조 |
| 수익화 방식 | 프리미엄 힌트 IAP, 광고 없음 |

---

## Step 2 — 미국 매출 순위 분석 (시장 컨텍스트)

> data.ai 직접 접근 없이 공개 시장 데이터 기반으로 분석한다.

**퍼즐 게임 시장 현황 (2024~2025)**
- 2024년 모바일 퍼즐 게임 다운로드: **75.3억 건** (전년 대비 +10.43%)
- 2024년 모바일 퍼즐 게임 매출: **60.5억 달러** (전년 대비 +48.88%)
- 퍼즐은 모바일 게임 다운로드의 **20% 점유** — 전체 장르 중 최대 수준
- 미국 iOS 매출 Top 10에는 Royal Match, Candy Crush Saga 등 Match-3 계열이 주도
- **그러나 미니멀 로직 퍼즐은 IAP 매출 순위보다 다운로드 · 유저 충성도로 성과를 낸다**

**미니멀 로직 퍼즐의 수익 구조적 특성**
- 광고 참여율이 타 장르 대비 2.5배 높음 (여유로운 플레이 상태가 광고 친화적)
- 프리미엄 or 힌트 IAP 모델로도 충분히 지속 가능한 수익 달성
- Zach Gage (Good Sudoku, Knotwords) 등 인디 개발자가 프리미엄 모델로 지속 성공

---

## Step 3 — 세부 장르 필터링 및 게임 목록

### 스테디셀러 (2년 이상 시장 검증)

| 게임명 | 세부 장르 | 미국 매출 추정 순위 | 핵심 메카닉 | 수익화 방식 | 특이점 |
|--------|----------|-------------------|------------|------------|--------|
| **Flow Free** | 파이프 연결 퍼즐 | 퍼즐 Top 30~50 (스테디) | 같은 색 점 두 개를 파이프로 연결, 전체 보드 채우기 | 광고 + 확장팩 IAP | 1억+ 다운로드. 동일 메카닉으로 Bridges·Hexes 등 7개 파생작 출시. Big Duck Games 연매출 약 300만 달러 |
| **Good Sudoku** (Zach Gage) | 로직 퍼즐 (수독) | 퍼즐 Top 50~100 | 수독 기반, AI 힌트 시스템 + 기법 교육 | 유료 앱 (프리미엄) + 구독 | "힌트가 이유를 알려준다"는 UX 혁신. 리텐션 극대화 설계 |
| **Monument Valley 1/2** | 착시 공간 퍼즐 | 프리미엄 Top (장르 내) | 에셔식 불가능한 건축물 조작 | 유료 앱 (프리미엄) | 1400만 DAU(2024). 예술적 비주얼로 글로벌 차트 장악 |
| **Infinity Loop** | 루프 연결 퍼즐 | 퍼즐 Top 50~100 (글로벌) | 조각을 회전해 완전한 루프 완성 | 광고 기반 (무료) | 릴렉스 포지셔닝, 타이머 없음. 미니멀 퍼즐 중 다운로드 상위 |
| **Knotwords** (Zach Gage) | 단어 로직 퍼즐 | 상위 인디 퍼즐 | 섹션 내 글자 배치로 가로·세로 단어 완성 | 무료 + 구독 (데일리 아카이브) | Wordle 창시자가 "믿을 수 없이 우아하다"고 극찬 |

### 신규 진입 (2024~2025 주목작)

| 게임명 | 세부 장르 | 출시 | 핵심 메카닉 | 수익화 방식 | 특이점 |
|--------|----------|------|------------|------------|--------|
| **Monument Valley 3** | 착시 공간 퍼즐 | 2024.12 (Netflix) | 불가능 건축물 + 계절별 신규 콘텐츠 라이브 서비스 | Netflix 구독 → 2025.7 Steam/콘솔 출시 | Netflix 독점 후 플랫폼 철수. "PC 퍼스트" 전략 전환 |
| **Faraway** (Annapurna) | 미니멀 물리/스킬 퍼즐 | 2025 (Steam) | 별자리를 버튼 하나로 그리는 절차 생성 오디오비주얼 | 유료 앱 | "2025년의 테트리스"로 불림. 싱글 개발자 작품 |
| **LOK Digital** | 단어+논리 퍼즐 | 2024 (PC/Mobile) | 단어검색+셀 채우기 하이브리드 | 유료 | 인디 퍼즐 커뮤니티(Thinky Games)에서 2024년 최고 혁신작으로 선정 |

---

## Step 4 — 리텐션 지표 검증 및 핵심 레퍼런스 선정

### 모바일 퍼즐 장르 리텐션 벤치마크 (2024 기준)

| 지표 | 모바일 전체 평균 | 상위 25% | 미니멀 로직 퍼즐 추정 |
|---|---|---|---|
| D+1 리텐션 | 26~28% | 30~35% | **35~50%** (추정)* |
| D+7 리텐션 | 3~4% | 7~8% | **10~20%** (추정)* |
| D+30 리텐션 | ~3% | 5~6% | 5~8% (추정)* |

> *추정 근거: 미니멀 로직 퍼즐은 광고/푸시 의존도가 낮고 내재적 동기 기반 복귀 패턴이 강해 장르 평균보다 D+1·D+7 모두 높게 나타나는 경향이 있다. Zach Gage 스타일 게임들은 "daily puzzle" 구조로 D+30까지도 높은 복귀율을 보인다.

---

## 추천 레퍼런스 게임 종합표

| 게임명 | 세부 장르 | 미국 매출 순위 | D+1 추정 | D+7 추정 | 핵심 메카닉 |
|--------|----------|--------------|---------|---------|-----------|
| **Flow Free** | 파이프 연결 | Top 30~50 (스테디) | ~40% | ~15% | 색 연결+보드 채우기 |
| **Monument Valley 1/2** | 착시 공간 | 프리미엄 Top | ~50% | ~20% | 불가능 건축물 조작 |
| **Good Sudoku** | 로직(수독) | 인디 Top 50 | ~45% | ~18% | AI 힌트+기법 학습 |
| **Infinity Loop** | 루프 연결 | Top 50~100 | ~38% | ~12% | 조각 회전으로 루프 완성 |
| **Knotwords** | 단어 로직 | 인디 Top 30 | ~48% | ~20% | 글자 재배열+크로스워드 |
| **Monument Valley 3** | 착시 공간 | 신규 (2024) | 미공개 | 미공개 | 건축 조작+시즌 콘텐츠 |
| **Faraway** (Annapurna) | 미니멀 스킬 | 신규 (2025) | 미공개 | 미공개 | 버튼 1개 절차생성 |

---

## 핵심 레퍼런스: Flow Free + Good Sudoku

이 두 게임이 Zhed류 미니멀 로직 퍼즐 개발의 가장 직접적인 시장 검증 레퍼런스다.

### Flow Free에서 배울 점

- **"Fill the Board" 완성 감**: 보드를 전부 채웠을 때의 시각적 완성 피드백이 Zhed와 동일한 만족감 구조다. 이 완성감이 재플레이 동기의 핵심.
- **파생 메카닉 확장 전략**: 동일 핵심 로직(연결)을 유지하면서 Bridges, Hexes, Shapes로 변형 → 각각 신규 퍼즐 경험 제공. Zhed도 그리드 변형(육각형, 장애물, 다중 목표)으로 확장 가능.
- **광고 친화적 릴렉스 UX**: 타이머 없음 + 광고 삽입 = 2.5배 높은 광고 참여율. 수익화와 UX 비침략성을 동시에 달성.
- **1억 다운로드 검증**: 단순한 메카닉이 전 세계적으로 통한다는 가장 강력한 시장 증거.

### Good Sudoku에서 배울 점

- **"왜 그 답인지 알려주는" 힌트 시스템**: 단순히 정답을 주는 게 아니라 논리 기법을 가르치는 힌트 → 유저가 성장하는 느낌 = 장기 리텐션 핵심 드라이버.
- **Daily Puzzle + 리더보드**: 매일 돌아올 이유를 구조화. Zhed에 "오늘의 퍼즐" 기능 추가 시 D+30 리텐션 대폭 개선 가능.
- **인디 프리미엄 모델 가능성 증명**: 벤처 자본 거부, 프리미엄 유료 or 구독으로 지속 가능한 비즈니스 유지. Zach Gage 방식은 Zhed 후속작 모델로 직접 적용 가능.
- **플랫폼 확장 (Puzzmo)**: 퍼즐 게임을 웹/구독 기반으로 번들화하는 전략. 미니멀 로직 퍼즐 포트폴리오 확장 시 참고.

---

## 차별화 기회 (시장의 빈틈)

### Flow Free가 못하는 것
- 메카닉이 12년째 그대로 → 유저가 "봤던 거"라는 인식 강함
- 숫자·수리적 로직이 없음 → Zhed의 숫자 기반 확장은 차별화 포인트
- 아트 스타일이 단순함 → 미니멀하지만 감성적인 비주얼로 차별화 여지

### Good Sudoku가 못하는 것
- 수독 원형에 종속 → 진입 장벽 있음 (수독 싫어하는 사람에게 안 닿음)
- 공간·시각적 메카닉 없음 → 그리드 공간 퍼즐 좋아하는 유저층에 공백

### 현재 시장의 빈틈
1. **숫자 기반 그리드 확장 로직** (Zhed의 핵심): 이 세부 서브장르는 아직 지배적 타이틀 없음
2. **일일 퍼즐 + 커뮤니티**: Wordle·Good Sudoku처럼 매일 하나씩 푸는 소셜 공유 구조가 Zhed류에는 없음
3. **AI 적응형 난이도**: 플레이어 실력에 맞게 레벨을 생성하는 절차 생성 활용이 부재
4. **프리미엄 감성 포지셔닝**: Monument Valley 수준의 아트 + Zhed의 순수 로직 결합한 포지셔닝이 공백으로 존재
5. **PC/콘솔 크로스 플랫폼**: Monument Valley 3의 Netflix 실패 이후 Steam 기반 미니멀 로직 퍼즐 진공 상태

---

## data.ai에서 직접 확인할 항목

- [ ] 미국 iOS 매출 Top 100 중 "Logic/Grid Puzzle" 세부 필터 게임 목록 (최근 30일 + 3개월 전 비교)
- [ ] Flow Free D+1, D+7 리텐션 vs 퍼즐 장르 평균 비교
- [ ] Good Sudoku / Knotwords D+1, D+7 vs 인디 퍼즐 평균 비교
- [ ] 신규 진입 그리드 로직 퍼즐 게임 (최근 6개월 기준, "number puzzle" / "grid logic" 키워드)
- [ ] Zhed 현재 월간 활성 유저 및 리텐션 곡선 확인
- [ ] 미국 퍼즐 앱 검색 트렌드: "logic puzzle game", "number grid puzzle" 키워드 볼륨 추이

---

## 최종 요약 및 개발 방향 제언

> 레퍼런스는 모방 대상이 아니라 **차별화 기준선**이다.

| 전략 목표 | 추천 레퍼런스 | 핵심 교훈 |
|---|---|---|
| 핵심 루프 설계 | Flow Free | 보드 완성 피드백 + 비압박적 UX |
| 리텐션 시스템 | Good Sudoku | 일일 퍼즐 + 학습형 힌트 |
| 아트/포지셔닝 | Monument Valley | 감성 + 로직의 결합 |
| 수익화 모델 | Knotwords / Good Sudoku | 프리미엄 or 구독 (광고 최소화) |
| 메카닉 혁신 기준 | Zhed 자체 | 숫자 확장 그리드는 이미 독자적 — 레벨 다양성과 일일 퍼즐로 확장 |

**Zhed류 신작이 공략할 포지션**: "미니멀하고 순수한 논리 퍼즐 + 매일 돌아올 이유 + 아름다운 감성" — 이 셋을 동시에 잡은 타이틀이 현재 시장에 없다. 이것이 가장 큰 기회다.

---

## 참고 출처

- [Puzzle Games Revenue and Usage Statistics (2026) - Business of Apps](https://www.businessofapps.com/data/puzzle-games-market/)
- [Flow Free - Wikipedia](https://en.wikipedia.org/wiki/Flow_Free)
- [Big Duck Games | Makers of Flow Free](https://www.bigduckgames.com/)
- [ZHED - Puzzle Game on Steam](https://store.steampowered.com/app/543040/ZHED__Puzzle_Game/)
- [Zhed is a challenging numerical puzzler - Pocket Gamer](https://www.pocketgamer.com/zhed/zhed-is-a-challenging-numerical-puzzler-out-now-on-the-app-store/)
- [Good Sudoku by Zach Gage - App Store](https://apps.apple.com/us/app/good-sudoku-by-zach-gage/id1489118195)
- [Monument Valley 3 - Wikipedia](https://en.wikipedia.org/wiki/Monument_Valley_3)
- [This minimalist puzzle game could be 2025's Tetris - Digital Trends](https://www.digitaltrends.com/gaming/faraway-hands-on-impressions-annapurna/)
- [Logic Puzzle Games Market Research Report 2034 - MarketIntelo](https://marketintelo.com/report/logic-puzzle-games-market)
- [Casual Games Report H1 2025 - AppMagic](https://appmagic.rocks/research/casual-report-h1-2025)
- [Mobile Game Retention Benchmarks - Mistplay](https://business.mistplay.com/resources/mobile-game-retention-benchmarks)
- [GameAnalytics: Benchmarks in Mobile Games Q1 2024](https://gamedevreports.substack.com/p/gameanalytics-benchmarks-in-mobile)
- [Puzzle Mobile Games in 2025: Market Overview - FoxData](https://foxdata.com/en/blogs/puzzle-mobile-games-in-2025-market-overview-user-acquisition-strategies/)
- [Zach Gage Wikipedia](https://en.wikipedia.org/wiki/Zach_Gage)
- [Puzzmo co-creator Zach Gage interview - Game Developer](https://www.gamedeveloper.com/design/puzzmo-co-creator-zach-gage-on-building-newspaper-games-that-can-last-forever)
