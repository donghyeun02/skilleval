# Reference

## evals.json

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `skill_name` | string | ✅ | 스킬 이름 |
| `evals[].id` | integer | ✅ | eval 번호. 스위트 안에서 겹치면 안 됨 |
| `evals[].prompt` | string | ✅ | 실행한 프롬프트. 비어 있으면 안 됨 |
| `evals[].expected_output` | string | ✅ | 사람이 읽는 기대 결과 설명. 빈 문자열 허용 |
| `evals[].files` | string[] | | 입력 파일 (skill-creator 호환용, 채점에 안 씀) |
| `evals[].expectations` | string[] | | 자연어 기준. 채점하지 않고 리포트의 "Not graded"에 표시 |
| `evals[].assertions` | Assertion[] | | 코드로 채점하는 검사. 없으면 그 eval은 통과율에 들어가지 않음 |

eval 항목의 모르는 키는 무시합니다(skill-creator에 필드가 늘어나도 깨지지 않게). assertion의 모르는 키는 거부합니다(`ignorecase` 같은 오타가 조용히 무시되면 검사가 약해지므로).

형식이 틀리면 JSON 경로와 함께 exit 2로 끝납니다.

```
skilleval: $.evals[0].assertions[1].pattern: Invalid regular expression: /(/: Unterminated group
```

## Assertion

모든 assertion은 `name`(선택)을 받습니다. 없으면 기본 이름이 붙습니다. 이름은 기준선 비교의 키라서 한 eval 안에서 겹치면 안 됩니다.

| type | 옵션 | 통과 조건 |
|---|---|---|
| `contains` | `value`, `ignore_case` | 결과에 `value`가 있음 |
| `not-contains` | `value`, `ignore_case` | 결과에 `value`가 없음 |
| `regex` | `pattern`, `flags` | 정규식이 한 번 이상 매치. `^`를 줄 단위로 쓰려면 `"flags": "m"` |
| `heading` | `pattern`, `flags` | Markdown 제목(`#`~`######`) 중 하나가 정규식에 매치. 본문과 코드 블록은 보지 않음 |
| `min-table-rows` | `count` | 가장 큰 GFM 표의 데이터 행(헤더·구분선 제외)이 `count` 이상. 코드 블록 안의 표는 세지 않음 |
| `min-chars` | `count` | 글자 수가 `count` 이상. 글자 수는 사람이 보는 글자 기준 (`👍🏽` = 1) |
| `max-chars` | `count` | 글자 수가 `count` 이하 |

정규식은 evals.json을 읽을 때 미리 컴파일해서, 잘못된 패턴은 채점 전에 걸러집니다. `g`, `y` 플래그는 매치 위치를 바꾸므로 거부합니다.

## 결과 폴더 (fixtures)

skill-creator 워크스페이스 구조를 그대로 읽습니다.

```
<fixtures>/
  eval-0-match3/
    with_skill/outputs/result.md
    without_skill/outputs/result.md
  eval-1/...
```

- 폴더 이름은 `eval-<id>` 또는 `eval-<id>-<아무거나>`. `eval-1`이 `eval-10`과 섞이지 않습니다.
- `outputs/` 안의 `.md`, `.txt`를 이름순으로 빈 줄 하나를 두고 이어 붙여 채점합니다. 리포트의 줄 번호는 이어 붙인 텍스트 기준입니다. 다른 확장자는 무시합니다.
- 같은 id에 폴더가 둘 이상이면(`eval-0-a`, `eval-0-b`) 추측하지 않고 exit 2로 끝납니다.
- 파일이 없으면 어떤 경로를 찾았는지 알려 주고 exit 2로 끝납니다.

## CLI

```
skilleval grade --evals <path> --fixtures <dir> [--variants <list>] [--format md|json]
                [--out <path>] [--baseline <report.json>] [--tolerance <0..1>]
```

| 옵션 | 기본값 | 설명 |
|---|---|---|
| `--variants` | `with_skill,without_skill` | 채점할 쪽. 결과가 한쪽만 있으면 `with_skill` |
| `--format` | `md` | `json`은 다음 실행의 `--baseline`으로 그대로 쓸 수 있음 |
| `--out` | stdout | 파일로 저장 |
| `--baseline` | | 이전 JSON 리포트. `with_skill` 결과를 assertion 단위로 비교 |
| `--tolerance` | `0` | 기준선에서 통과하던 assertion 중 실패로 뒤집혀도 되는 비율. `0.1` = 10%까지 허용 |

### 기준선 비교 규칙

- 비교 단위는 (eval id, assertion 이름)입니다. 양쪽에 다 있는 assertion만 비교합니다.
- 기준선에서 통과하던 것 중 지금 실패하는 비율이 `tolerance`를 넘으면 회귀입니다. 새로 통과한 assertion은 리포트에 보여 주지만 실패를 상쇄하지 않습니다.
- 다음은 비교 자체를 거부하고 exit 2로 끝납니다: `schemaVersion`이 다름, `skillName`이 다름, 기준선이나 현재 실행에 채점된 assertion이 0개, 공통 assertion이 0개.

### exit code

| code | 뜻 |
|---|---|
| 0 | 정상 (기준선이 없거나, 기준선 이상) |
| 1 | 기준선 대비 회귀. 1은 이 경우에만 씀 |
| 2 | 사용법 오류, evals.json·기준선 형식 오류, 파일 읽기·쓰기 실패 |
| 70 | skilleval 자체 버그 (스택 트레이스 출력) |

## JSON 리포트

```jsonc
{
  "schemaVersion": 1,
  "skillName": "find-game-reference",
  "generatedAt": "2026-11-02T06:35:11.310Z",
  "summary": {
    "with_skill": { "passed": 29, "total": 30, "passRate": 0.9667 },
    "without_skill": { "passed": 5, "total": 30, "passRate": 0.1667 }
  },
  "evalsWithoutAssertions": [],
  "evals": [
    {
      "id": 0,
      "prompt": "...",
      "ungradedExpectations": [],
      "variants": [
        {
          "variant": "with_skill",
          "source": "eval-0-match3/with_skill/outputs",
          "passed": 9,
          "total": 10,
          "assertions": [{ "name": "출처 링크", "passed": false, "evidence": "no match" }]
        }
      ]
    }
  ],
  "compare": {
    "baseline": 0.9667, "current": 0.9333, "delta": -0.0333,
    "newlyFailing": [{ "evalId": 1, "assertion": "출처 링크" }],
    "newlyPassing": [],
    "compared": 30,
    "regressed": true
  }
}
```

`compare`는 `--baseline`을 줬을 때만 들어갑니다. `source`는 `--fixtures` 기준 상대 경로라서 다른 컴퓨터에서 만든 기준선과도 비교됩니다.
