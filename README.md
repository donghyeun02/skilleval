# skilleval

에이전트 스킬을 고쳤을 때 **나빠지지 않았는지**를 사람 눈 대신 코드로 확인하는 CLI입니다.

## 왜 만들었나

Claude Code 스킬을 고칠 때마다 같은 일을 반복했습니다. 같은 질문을 스킬을 켜고 한 번, 끄고 한 번 돌린 다음, 결과 파일 두 개를 열어서 "켠 게 나은 것 같다"고 감으로 판단했습니다. 스킬이 늘어나자 고친 스킬이 다른 eval에서 나빠진 걸 놓치기 시작했습니다.

[skill-creator](https://github.com/anthropics/skills)에도 eval 기능이 있지만, 세션 안에서 대화하며 쓰는 도구이고 채점도 주로 grader 에이전트가 합니다. 제가 필요했던 건 그다음 단계였습니다.

| | skill-creator | skilleval |
|---|---|---|
| 쓰는 곳 | 세션 안, 대화형 | 터미널·CI, 헤드리스 |
| 채점 | grader 에이전트 | 코드로 검사하는 assertion. 모델이 자기 결과를 채점하지 않음 |
| 결과 | 뷰어 | Markdown/JSON 리포트, 기준선보다 떨어지면 exit 1 |
| 관계 | — | skill-creator의 `evals.json`과 워크스페이스 폴더를 그대로 읽음 |

대체재가 아니라 skill-creator 뒤에 붙는 회귀 검사 단계입니다.

## 실제 결과

이 레포의 [`examples/find-game-reference`](examples/find-game-reference)는 제가 쓰는 게임 레퍼런스 스킬의 eval 3건입니다. 스킬 문서의 "출력 포맷"과 "주의사항"에서 규칙 10개를 뽑아 eval마다 똑같이 걸었습니다 (3건 × 10개 = 30개).

```
| variant | passed | pass rate |
|---|---|---|
| with_skill | 29/30 | 97% |
| without_skill | 5/30 | 17% |

- eval 0 · with_skill: ❌ 출처 링크 — no match
```

- 스킬을 켜면 스킬이 요구하는 형식을 거의 지킵니다.
- 스킬을 켜도 eval 0(매치3)은 "출처 링크를 항상 포함한다"는 규칙을 어겼습니다. 결과 파일을 눈으로 볼 때는 못 찾았던 문제입니다.
- **이 숫자는 추천 품질이 아니라 형식 준수율입니다.** 스킬을 끈 쪽은 그 형식을 모르니 낮게 나오는 게 당연합니다. 추천이 좋은지는 assertion으로 잴 수 없고, 그 부분은 리포트에 "Not graded"로 따로 남깁니다.

## 설치

Node.js 22 이상이 필요합니다.

```bash
git clone https://github.com/donghyeun02/skilleval
cd skilleval
npm ci && npm run build
npm link   # skilleval 명령 등록 (선택)
```

## 사용법

```bash
skilleval grade --evals evals.json --fixtures <workspace>/iteration-1
```

기준선과 비교해서 나빠지면 실패시키기:

```bash
# 지금 결과를 기준선으로 저장
skilleval grade --evals evals.json --fixtures runs --format json --out baseline.json

# 스킬을 고치고 다시 돌린 뒤 비교
skilleval grade --evals evals.json --fixtures runs --baseline baseline.json
```

```
Baseline: 97% → 93% (**REGRESSION**, 30 assertions compared)
- newly failing: eval 1 · 출처 링크
```

**회귀는 전체 통과율이 아니라 assertion 하나하나로 판단합니다.** 기준선에서 통과하던 assertion이 지금 실패하면 회귀입니다. 다른 eval이 좋아져서 평균이 그대로여도 걸립니다. `--tolerance 0.1`을 주면 기준선 통과 assertion의 10%까지는 뒤집혀도 봐줍니다.

| exit code | 뜻 |
|---|---|
| 0 | 정상 |
| 1 | 기준선 대비 회귀 (이 경우에만 1) |
| 2 | 사용법 오류, evals.json·기준선 형식 오류, 파일 읽기·쓰기 실패 |
| 70 | skilleval 자체 버그 |

CI가 exit 1을 "스킬이 나빠졌다"로만 읽을 수 있도록, 입력 문제나 내부 오류는 1을 쓰지 않습니다.

스킬을 끈 결과가 없으면 `--variants with_skill`로 한쪽만 채점할 수 있습니다.

### evals.json

skill-creator 형식에 `assertions`만 더했습니다. 기존 파일은 그대로 읽힙니다.

```json
{
  "skill_name": "find-game-reference",
  "evals": [
    {
      "id": 0,
      "prompt": "캔디크러쉬 같은 매치3 게임 레퍼런스 찾아줘",
      "expected_output": "레퍼런스 게임 표, 차별화 기회, 체크리스트",
      "assertions": [
        { "type": "heading", "pattern": "차별화", "name": "'차별화 기회' 섹션" },
        { "type": "min-table-rows", "count": 3 },
        { "type": "regex", "pattern": "https?://", "name": "출처 링크" }
      ]
    }
  ]
}
```

assertion 종류와 옵션은 [docs/reference.md](docs/reference.md)에 있습니다.

### 라이브러리로 쓰기

```ts
import { readFile } from 'node:fs/promises';
import { FixtureRunner, evaluateSuite, parseEvalSuite, renderMarkdown } from 'skilleval';

const suite = parseEvalSuite(JSON.parse(await readFile('evals.json', 'utf8')));
const report = await evaluateSuite(suite, new FixtureRunner('runs'));
console.log(renderMarkdown(report));
```

`Runner` 인터페이스를 구현하면 결과를 파일 대신 다른 곳(모델 API 등)에서 가져올 수 있습니다.

## 하지 않는 것

- **모델을 직접 호출하지 않습니다.** 지금은 이미 만들어진 결과 파일만 채점합니다.
- **글의 품질을 판정하지 않습니다.** 판정할 수 있는 건 구조와 문자열뿐입니다. skill-creator의 `expectations`(자연어 기준)는 채점하지 않고 리포트에 그대로 표시합니다.
- **채점 결과를 점수 하나로 뭉뚱그리지 않습니다.** 어떤 assertion이 왜 실패했는지 줄 번호와 함께 보여 줍니다. 결과 파일이 여러 개면 이어 붙인 텍스트 기준 줄 번호입니다.

## 알려진 한계

- LLM 출력은 실행할 때마다 달라집니다. 한 번 돌린 결과로 회귀를 판단하면 우연히 뒤집힌 assertion을 회귀로 볼 수 있습니다. 지금은 `--tolerance`로 허용 폭을 주는 게 전부이고, 여러 번 돌려 분산을 보는 기능은 없습니다.
- 정규식은 신뢰할 수 있는 evals.json을 전제로 합니다. 지나치게 느린 패턴(ReDoS)을 막지 않습니다.
- assertion은 형식을 재는 데 강하고 내용을 재는 데 약합니다. 형식이 맞는데 틀린 정보를 쓴 결과는 통과합니다.

## 개발

```bash
npm run check   # lint → typecheck → test → build
```

- TypeScript `strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`, typescript-eslint `strictTypeChecked`. 런타임 의존성은 0개입니다.
- 외부 입력(evals.json, 기준선 JSON)은 `unknown`으로 받아 검증한 뒤 타입을 좁힙니다. assertion에 모르는 키가 있으면 거부해서 오타가 검사를 약하게 만들지 못하게 했습니다.
- CI는 Node 22·24에서 위 검사와 `npm audit`을 돌리고, 예제를 기준선과 비교하고, 패키징한 tarball을 새 프로젝트에 설치해 CLI와 import가 되는지 확인합니다. Actions는 커밋 SHA로 고정했습니다.

```
src/
  errors.ts             InputError: 사용자가 고칠 수 있는 오류 → exit 2
  schema/evals.ts       evals.json 검증 (unknown → 타입)
  graders/assertions.ts assertion 채점 (순수 함수)
  runners/              결과를 가져오는 곳. fixture = 디스크
  grade.ts              스위트 전체 채점·요약
  compare.ts            기준선과 assertion 단위 비교
  report/markdown.ts    리포트 출력
  cli.ts                인자 파싱과 exit code
```

## 라이선스

MIT
