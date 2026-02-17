# CAMPUS:FORM

> 동아리 리크루팅, 이제 캠퍼스폼 하나로 끝

구글폼 모집, 스프레드시트 수작업, 문자 발송, 면접 시간표 수작업까지 — 동아리 모집의 모든 과정을 하나로 관리하는 올인원 서비스입니다.

🔗 [캠퍼스폼 바로가기](https://web.campus-form-server.kro.kr/)

<br/>

## ✨ 주요 기능

- **지원자 카드** — 구글 스프레드시트 연동으로 지원자 정보를 자동 분류
- **합불 분류** — 서류·면접 단계별 합격/불합격 상태 관리 및 분류
- **결과 요약 & 문자 템플릿** — 합격/불합격 명단, 단체 문자 발송
- **스마트 시간표** — 면접 시간표 자동 추천 및 지원자 직접 시간 조정 기능

<br/>

## 🛠 기술 스택

| 분류              | 사용 기술                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 언어 / 라이브러리 | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) ![Zustand](https://img.shields.io/badge/Zustand-443E38?style=flat&logo=zustand&logoColor=white) |
| 프레임워크        | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 서버 / 배포       | ![Bruno](https://img.shields.io/badge/Bruno-FF6C37?style=flat&logo=bruno&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)                                                                                                                                                                                                                                                                                                                                   |
| 협업              | ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white) ![Notion](https://img.shields.io/badge/Notion-000000?style=flat&logo=notion&logoColor=white) ![Discord](https://img.shields.io/badge/Discord-5865F2?style=flat&logo=discord&logoColor=white)                                                                                                                                                                                                                                |
| 디자인            | ![Figma](https://img.shields.io/badge/Figma-F24E1E?style=flat&logo=figma&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Lint / Format     | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=prettier&logoColor=black)                                                                                                                                                                                                                                                                                                                          |

<br/>

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── auth/           # 로그인
│   ├── home/           # 홈
│   ├── document/       # 서류
│   ├── interview/      # 면접
│   ├── manage/         # 관리
│   ├── oauth/          # OAuth 콜백
│   └── smart-schedule/ # 스마트 시간표
├── components/         # 공통 컴포넌트
├── hooks/              # 커스텀 훅
├── lib/                # API 클라이언트
├── services/           # API 서비스 레이어
├── store/              # 전역 상태 관리
├── style/              # 전역 스타일
└── types/              # TypeScript 타입 정의
```

<br/>

## 👥 팀원

|                                   <img src="https://github.com/SeOinm.png" width="100">                                   |                                   <img src="https://github.com/Ssopaa.png" width="100">                                   |                                   <img src="https://github.com/gustmd98.png" width="100">                                   |
| :-----------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: |
|                                                          문서인                                                           |                                                          조세현                                                           |                                                           이현승                                                            |
|                                                    FE(Lead Developer)                                                     |                                                            FE                                                             |                                                             FE                                                              |
|                                로그인·서류 페이지 구현<br>로그인·서류·댓글·관리·알림 연동                                 |                                홈·마이·관리·알림 페이지 구현<br>스마트 시간표 구현 및 연동                                |                                       면접 페이지 구현 및 연동<br>서류·면접 마감 연동                                       |
| [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/SeOinm) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/Ssopaa) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/gustmd98) |
