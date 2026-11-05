# 기도노트 (Prayer Note)

매일의 기도와 깨달음을 달력 위에 조용히 기록하는 따뜻한 디지털 일기장입니다.
연한 핑크와 크림색의 수채화 분위기, 심플한 입력 방식, CSV 백업을 담았습니다.

## 주요 기능

- **달력 보기** · 1주 / 1달 / 6개월 / 1년 단위로 마음의 기록을 살펴보기
- **오늘 중심 보기** · 기본 1주 보기에서 오늘을 가운데 두고 전날·전전날은 은은하게 표시
- **한 줄 일기** · 날짜를 누르면 그날의 기도와 깨달음을 메모장처럼 입력
- **자동 저장소** · 브라우저/앱 내부 저장소(localStorage)에 기록 보관
- **CSV 백업 & 복원** · 언제든 내려받아 보관하고 다시 불러오기
- **소스 ZIP 내려받기** · 설정 화면에서 이 프로젝트 전체를 ZIP으로 내려받기
- **Android APK 자동 빌드** · GitHub Actions + Capacitor로 설치 가능한 APK 생성

## 내 컴퓨터에서 실행하기

```bash
npm install
npm run dev
```

브라우저에서 표시되는 주소(보통 http://localhost:5173)를 엽니다.

## 웹 앱 빌드

```bash
npm run build
```

`dist` 폴더에 결과물이 만들어집니다.

## GitHub에 올리고 APK 만들기

1. github.com 에서 **New repository** → 이름을 `prayer-tree`로 만듭니다.
2. 저장소의 **Add file → Upload files** 로 이 폴더의 파일을 올립니다.
   - 올리기: `index.html`, `package.json`, `package-lock.json`, `vite.config.ts`,
     `tsconfig.json`, `capacitor.config.json`, `.gitignore`, `.github`, `src`
   - 올리지 않기: `node_modules`, `dist`
3. `.github/workflows/android-apk.yml` 파일은 그대로 저장소에 포함되어 있습니다.
   (숨김 폴더라도 `Add file → Create new file` 로 같은 경로에 붙여넣어도 됩니다.)
4. **Actions** 탭 → 왼쪽 **APK 빌드** → **Run workflow** 버튼을 누릅니다.
5. 5~8분 뒤 초록 체크가 되면 빌드를 클릭하고, 맨 아래 **Artifacts**에서
   `prayer-tree-apk`를 내려받아 압축을 풀면 `app-debug.apk`가 나옵니다.
6. APK를 휴대폰으로 옮겨 설치합니다. (출처를 알 수 없는 앱 설치 허용이 필요할 수 있어요.)

> 최초 한 번은 Actions 탭에서 워크플로를 활성화하는 버튼이 보일 수 있습니다.
> 저장소의 Settings → Actions → General 에서 Workflow permissions가
> **Read repository contents** 이상인지 확인해 주세요.

## CSV 백업 형식

백업 파일은 Excel에서도 잘 열리도록 UTF-8 BOM으로 저장됩니다.

```csv
date,content,updated_at
2026-05-14,"오늘의 기도 내용","2026-05-14T12:30:00.000Z"
```

- `date`: `YYYY-MM-DD`
- `content`: 여러 줄 가능 (따옴표로 감싸짐)
- `updated_at`: ISO 8601 형식의 마지막 저장 시각
- 한국어 헤더(`날짜,내용`)로 된 CSV도 불러올 수 있습니다.

## 폴더 구조

```text
.
├── .github/workflows/android-apk.yml   # APK 자동 빌드
├── index.html
├── capacitor.config.json
├── package.json
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── CalendarSection.tsx
│   │   ├── CalendarViews.tsx
│   │   ├── DayEditor.tsx
│   │   ├── HomePage.tsx
│   │   ├── JournalPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── icons.tsx
│   ├── lib
│   │   ├── date.ts
│   │   ├── storage.ts
│   │   └── source-export.ts
│   └── assets
│       ├── hero-hill.png
│       └── note-desk.png
└── vite.config.ts
```

## 참고

- 모든 기록은 기기 안에만 저장됩니다. 서버로 전송되지 않습니다.
- 브라우저 저장소를 지우면 기록도 사라지므로, 가끔 CSV로 백업해 주세요.
- 첫 실행 시 달력을 미리 볼 수 있도록 따뜻한 예시 기록이 몇 개 담겨 있습니다.
  설정 → 기록 관리에서 모두 지울 수 있습니다.

기도노트와 함께 평안한 하루를 보내시길 바랍니다.
