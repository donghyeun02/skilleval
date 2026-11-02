# 합성(Merge) + 아이들(Idle) 게임 글로벌 레퍼런스 분석

## Step 1 — 세부 장르 명확화

사용자가 언급한 "합성 게임"과 "아이들 게임"은 스토어 카테고리상 모두 **캐주얼** 또는 **퍼즐**에 해당하지만, 실제 세부 장르는 다음과 같이 구분된다:

| 사용자 언급 | 세부 장르 | 핵심 메카닉 |
|---|---|---|
| 합성 게임 | Merge-2 (두 개 합치기) | 아이템 합성 → 주문 완료 → 보드 관리 |
| 아이들 게임 | Idle RPG / Idle Clicker | 자동 전투 + 오프라인 보상 |

> 이 분석은 두 세부 장르 모두를 커버하며, 글로벌(특히 미국) 매출 상위 검증 게임만을 대상으로 한다.

---

## Step 2 — 미국 매출 순위 기반 분석 원칙

미국 iOS/Android 매출 상위 = 글로벌 성적 지표. data.ai(App Annie) 직접 접근이 없는 상황이므로, AppMagic·Sensor Tower·PocketGamer 등 공개 시장 데이터를 바탕으로 분석한다.

---

## Step 3 — 세부 장르 필터링 및 게임 목록

### 합성(Merge-2) 게임 Top 5 (2025년 기준 글로벌/미국 매출)

| 게임명 | 개발사 | 세부 장르 | 미국 매출 추정 순위 | 연간 매출(글로벌) | 유형 |
|---|---|---|---|---|---|
| Gossip Harbor | Microfun | Merge-2 + 스토리 | Top 20 이내 | ~$650M (2025) | 신규 → 스테디셀러 전환 |
| Travel Town | Moon Active / Magmatic | Merge-2 + 탐험 | Top 30 이내 | ~$291M (2025) | 스테디셀러 |
| Seaside Escape | Microfun | Merge-2 + 데코 | Top 40 이내 | ~$249M (2025) | 스테디셀러 |
| Merge Mansion | Metacore | Merge-2 + 미스터리 | Top 50 이내 | ~$200M+ (추정) | 스테디셀러 |
| Tasty Travels | Century Games | Merge-2 + 음식 | 급등 중 (Top 50) | $20M/월 (2026 Q1) | 신규 진입 |

### 아이들(Idle RPG / Idle Clicker) 게임 Top 3 (미국 시장 기준)

| 게임명 | 개발사 | 세부 장르 | 미국 매출 추정 | 유형 |
|---|---|---|---|---|
| Whiteout Survival | Century Games | Idle 4X 전략 | $870M (미국 누적, ~28% 점유) | 스테디셀러 |
| AFK Journey | Lilith Games | Idle RPG 오픈월드 | $150M+ (글로벌, 2024 출시) | 신규 → 안착 |
| AFK Arena | Lilith Games | Idle RPG 전략 | 하락 중 ($77M/2023) | 레거시 |

---

## 핵심 레퍼런스 게임 상세 분석

---

### 핵심 레퍼런스 #1: Gossip Harbor (합성 장르)

**왜 선정했는가:** 2024년 말 Travel Town·Merge Mansion을 추월해 전 세계 1위 합성 게임 달성. 2025년 분기 매출 $105M(+35% QoQ). Sensor Tower Q1 2025 기준 동종 장르 최고 리텐션 기록.

#### 핵심 메카닉
- Merge-2 보드: 제너레이터 탭 → 아이템 생성 → 두 개 합쳐 상위 아이템 → 주문 완료
- 에너지 시스템: 탭 시 에너지 소모, 자동 회복 + 유료 구매 가능
- 스토리 레이어: 드라마틱한 캐릭터 서사(가십/비밀/반전), 챕터마다 컷씬 제공
- 데코 메타: 주문 완료 → 마을 꾸미기 → 시각적 보상 루프

#### 수익화 방식
- **하이브리드**: IAP 중심(에너지팩, 부스터, 배틀패스) + 리워드 광고
- 가장 효율적 UA: 유료 광고가 다운로드의 78% 기여, ROAS는 경쟁작 대비 우수
- Travel Town 대비 광고비 절반 이하로 유사 매출 달성

#### 리텐션 (추정치, 업계 벤치마크 기반)
- D+1: **~45~50%** (장르 평균 20~30% 대비 탁월)
- D+7: **~18~20%** (장르 평균 8~12% 대비 우수)
- 주간 평균 세션 수: 41회 (Travel Town 32회 대비 +27%)
- 주간 평균 플레이 시간: 186분 (Travel Town 128분 대비 +45%)

#### 배울 점
- 스토리/감정 훅이 리텐션을 수치로 증명: 단순 합성 보드가 아니라 "다음 챕터 궁금해서 다시 켬"
- 드라마틱한 광고 소재(슬랙, 배신, 반전) → 고CTR UA 소재 전략
- 장르 메카닉은 Travel Town과 동일하지만, **테마·스토리 차별화만으로** 1위 탈환 가능함을 증명

#### 차별화 기회
- 스토리가 선형적 → 리플레이 가치 낮음
- 남성 유저 공략 약함 (주 타겟이 30~45세 여성)
- 합성 보드의 공간 관리가 여전히 스트레스 요인 (한정 슬롯 문제)
- PvP·길드 등 소셜 기능 부재 → 커뮤니티 유지 약점

---

### 핵심 레퍼런스 #2: Travel Town (합성 장르)

**왜 선정했는가:** 2022~2024년 Merge-2 장르 매출 1위 유지. 합성 게임의 에너지 시스템·고래(Whale) 과금 설계의 교과서.

#### 핵심 메카닉
- Merge-2 보드: 에너지가 핵심 자원, 탭 1회 = 에너지 소모
- Nested Chain / Combined Chain: 복잡한 합성 체인으로 깊이감 부여
- 탐험 맵: 새 지역 해금 → 새 합성 체인 언락 → 장기 목표 제공
- 패시브 에너지 재충전: 분당 자동 생성 → 재방문 유도

#### 수익화 방식
- **하이브리드 IAP+IAA**: 다이아몬드(프리미엄 화폐) → 에너지 구매가 핵심
- 최고가 팩 $120 = 8,000 다이아몬드 = 20,000 에너지 (고래 설계)
- 에너지 = 핵심 spend vector, 보드 공간보다 에너지 부족이 주 마찰점

#### 배울 점
- 에너지 경제 설계: 소모 속도·회복 속도의 정밀한 밸런싱이 DAU×ARPU 직결
- 고래 과금 경로가 명확 (에너지 → 더 많은 합성 → 더 빠른 진행)
- Moon Active 인수 후 UA 투자 폭발 → 마케팅 파워의 중요성

#### 차별화 기회
- 스토리/감성 요소 부족 → Gossip Harbor에게 1위 자리 내준 핵심 이유
- 에너지 시스템 의존도 과다 → 캐주얼 유저 이탈 원인
- 30~45분 이상 플레이 시 뚜렷한 마찰 구간 발생

---

### 핵심 레퍼런스 #3: Tasty Travels (합성 신규 진입)

**왜 선정했는가:** 2025년 12월 대비 2026년 초 월 매출 +71% 성장. March 2026 기준 $29.3M 달성으로 Merge-2 월 매출 2위 등극. Century Games가 Whiteout Survival로 쌓은 마케팅 역량을 합성 장르에 투입.

#### 핵심 메카닉
- Merge-2 보드 + 음식/여행 테마
- 새로운 IP로 차별화 시도 중

#### 시사점
- 합성 장르는 **대형 퍼블리셔가 진입 중**인 성장 시장
- "테마만 달리해도 충분히 신규 유저를 확보할 수 있다"는 시장 증거
- 2026년 초 기준 Merge-2 월 매출 점유: Gossip Harbor 48%, Travel Town 9%, Seaside Escape 7%, Tasty Travels 10%

---

### 핵심 레퍼런스 #4: AFK Journey (아이들 RPG)

**왜 선정했는가:** 2024년 3월 출시, 1억 6천만 다운로드·$150M+ 매출로 아이들 RPG 신규 1위 등극. AFK Arena의 직계 후속작으로 오픈월드 + 오프라인 보상 구조를 결합.

#### 핵심 메카닉
- 자동 전투: 팀 편성 → 전략적 배치 → 자동 진행
- 오프라인 보상: 앱 종료 중에도 자원·경험치 획득
- 오픈월드 탐험: 마을·던전 탐험 + 스토리 진행
- 시즌 콘텐츠: 길드 시스템, 정기 업데이트로 재방문 유도

#### 수익화 방식
- IAP 중심: 영웅 가챠 + 배틀패스 + 번들팩
- 크로스플랫폼: iOS·Android·Windows 지원 → 유저풀 극대화

#### 리텐션 (추정치)
- D+1: ~50~55% (스토리 몰입 + 즉각 보상으로 높은 편)
- D+7: ~20~25% (오프라인 보상이 재방문 강력 유도)

#### 배울 점
- "켜지 않아도 보상이 쌓인다" → 부담 없는 재방문 유도 공식
- 시각적 품질(스토리북 아트) + 전략 깊이의 결합이 코어·캐주얼 동시 공략
- IP 연속성(AFK Arena → AFK Journey): 기존 팬덤을 신작으로 자연 이전

#### 차별화 기회
- 진입 장벽: 영웅 수·시스템 복잡도가 높아 신규 유저 이탈률 존재
- 가챠 모델에 대한 피로도 축적
- 소셜 길드 시스템이 경쟁작 대비 아직 얕음
- "진짜 아이들"이 아닌 반(半)능동 게임 → 완전 방치형 원하는 유저 이탈

---

## 추천 레퍼런스 게임 요약 테이블

| 게임명 | 세부 장르 | 미국 매출 순위(추정) | D+1 추정 | D+7 추정 | 핵심 메카닉 | 수익화 |
|---|---|---|---|---|---|---|
| Gossip Harbor | Merge-2 + 스토리 | Top 20 | ~45~50% | ~18~20% | 합성 보드 + 드라마 스토리 + 데코 | 하이브리드(IAP 중심) |
| Travel Town | Merge-2 + 탐험 | Top 30 | ~40~45% | ~15~18% | 에너지 경제 + 합성 체인 + 지도 확장 | 하이브리드(IAP+IAA) |
| Merge Mansion | Merge-2 + 미스터리 | Top 50 | ~35~40% | ~12~15% | 미스터리 내러티브 + 저택 복원 | 하이브리드 |
| Tasty Travels | Merge-2 + 음식여행 | 급상승 중 | 측정 중 | 측정 중 | Merge-2 + 음식/여행 테마 | IAP+IAA |
| AFK Journey | Idle RPG 오픈월드 | Top 50 | ~50~55% | ~20~25% | 자동전투 + 오프라인보상 + 탐험 | IAP(가챠+배틀패스) |
| Whiteout Survival | Idle 4X 전략 | Top 10 | 측정 어려움 | 측정 어려움 | 기지건설 + 생존전략 + 자동진행 | IAP 하드코어 |

> **주의**: 리텐션 수치는 공개 데이터가 없어 업계 벤치마크 및 유사 게임 평균치로 추정한 값입니다. data.ai·Sensor Tower 직접 접근 시 정확한 수치로 대체 필요.

---

## 장르별 핵심 인사이트

### 합성(Merge-2) 장르 총평

**시장 규모**: 2025년 상반기 Merge 장르 단독 매출 $850M, 전년 대비 +62% 성장.

**집중도**: 상위 10개 게임이 전체 매출의 80% 차지 → 진입 어렵지만 한 번 자리 잡으면 매우 안정적.

**성공 공식**:
1. Merge-2 기본 메카닉 (필수, 검증 완료)
2. 강력한 테마/스토리 레이어 (Gossip Harbor의 성공 비결)
3. 에너지 기반 경제 + 고래 과금 경로
4. 데코·진행 보상으로 장기 목표 제공

**빈틈(시장 기회)**:
- 남성 유저 타겟 합성 게임 부재 (Chrome Valley Customs 스타일 + 합성 결합 가능)
- 완전 방치(Idle) + 합성 하이브리드: 에너지 없이도 자동으로 합성되는 구조
- PvP·길드 소셜 기능 강화한 합성 게임 부재
- 청소년·아동 친화적 테마 합성 게임 부재

### 아이들(Idle) 장르 총평

**시장 규모**: 글로벌 아이들 게임 시장 2024년 $25억, 2033년까지 CAGR 10.8% 성장 예상.

**성공 공식**:
1. 오프라인 보상 (재방문 강제하지 않음, 복귀 시 보상 확인)
2. 단순 진입 + 전략적 깊이 (Idle + 팀 빌딩)
3. 시각적 퀄리티 (AFK Journey가 아트로 차별화)
4. 시즌 콘텐츠 + 길드로 장기 리텐션 유지

**빈틈(시장 기회)**:
- 합성 + 아이들 하이브리드: 오프라인 중 자동 합성 → 접속 시 결과 수집
- 가챠 없는 아이들 게임 (구독 또는 직접 구매 모델)
- 아동/가족 대상 아이들 게임 (현재 대부분 성인 타겟)

---

## data.ai에서 직접 확인할 항목

- [ ] 미국 iOS 매출 Top 100 중 Merge-2 게임 목록 (최근 30일 + 3개월 전 비교)
- [ ] Gossip Harbor D+1, D+7 리텐션 vs 장르 평균 비교
- [ ] Travel Town vs Gossip Harbor 월별 미국 매출 추이 (2024~2026)
- [ ] AFK Journey D+1, D+7 리텐션 vs Idle RPG 장르 평균
- [ ] 신규 진입 Merge-2 게임 (최근 6개월 기준, Top 100 진입작)
- [ ] Tasty Travels 미국 단독 매출 비중 및 성장률
- [ ] Idle 장르 평균 리텐션 벤치마크 (D+1 / D+7 / D+30)

---

## 최종 권고

**합성 게임 기획 시**: Gossip Harbor를 1순위 레퍼런스로, Travel Town을 에너지·과금 설계 레퍼런스로 활용. 두 게임이 공통으로 취약한 **소셜 기능 + 남성 타겟 + Idle 자동화 합성** 방향이 현재 가장 유망한 차별화 포지션.

**아이들 게임 기획 시**: AFK Journey를 아트·스토리 기준선으로, Whiteout Survival을 장기 리텐션·과금 설계 기준으로 활용. 완전 방치형(탭 불필요)이면서 합성 진행 요소를 결합한 **Merge-Idle 하이브리드**가 두 장르의 교집합 유저를 동시에 공략하는 블루오션.

> **레퍼런스는 모방 대상이 아니라 차별화 기준선**입니다. 위 게임들이 검증한 핵심 메카닉은 유지하되, 이들이 못하거나 비어있는 영역에서 새로운 가치를 만들어야 합니다.

---

## 참고 자료 (Sources)

- [Gossip Harbor's Meteoric Rise in Merge — Naavik](https://naavik.co/digest/gossip-harbors-meteoric-rise-in-merge/)
- [How Gossip Harbor Became the Top-Grossing Merge Game — Udonis](https://www.blog.udonis.co/mobile-marketing/mobile-games/gossip-harbor)
- [Finding Genre Success: the Case of Gossip Harbor — Deconstructor of Fun](https://www.deconstructoroffun.com/blog/2024/8/19/finding-genre-success-the-case-of-gossip-harbor)
- [Travel Town Deconstruction: Merge-2 Whales — Gamigion](https://www.gamigion.com/travel-town-deconstruction-merge-2-whales/)
- [Deconstructing Travel Town — PocketGamer.biz](https://www.pocketgamer.biz/deconstructing-magmatic-games-travel-town/)
- [Tasty Travels: Merge Game Becomes Number Two — Gamigion](https://www.gamigion.com/tasty-travels-merge-game-becomes-number-two-by-monthly-revenue-in-merge-2/)
- [Merge Games Market Report 2026 — ASOTools](https://asotools.io/blog/merge-games-market-data-analysis-2026)
- [The top grossing mobile games of 2025 — PocketGamer.biz](https://www.pocketgamer.biz/the-top-grossing-mobile-games-of-2025/)
- [Top 5 Idle RPG Apps Performance in the US, Q2 2025 — Sensor Tower](https://sensortower.com/blog/2025-q2-unified-top-5-idle%20rpg-revenue-us-6040bbc2241bc16eb883a0cb)
- [Whiteout Survival hits $3bn — PocketGamer.biz](https://www.pocketgamer.biz/whiteout-survival-hits-3bn-in-player-spending-in-under-25-years/)
- [Casual Games Report H1 2025 — AppMagic](https://appmagic.rocks/research/casual-report-h1-2025)
- [GameAnalytics: Mobile gaming benchmarks in 2025 — GameDev Reports](https://gamedevreports.substack.com/p/gameanalytics-mobile-gaming-benchmarks)
- [A (Not So) Brief History of The Merge Genre — Gamigion](https://www.gamigion.com/a-not-so-brief-history-of-the-merge-genre/)
- [Merge Games Market: How This Subgenre Evolved — Udonis](https://www.blog.udonis.co/mobile-marketing/mobile-games/merge-games-market)
- [Best Idle Games on Mobile in 2026 — Udonis](https://www.blog.udonis.co/mobile-marketing/mobile-games/best-idle-games)
