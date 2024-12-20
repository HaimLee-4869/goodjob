# 구인구직 백엔드 서버


이 프로젝트는 사람인(Saramin) 사이트에서 채용 공고 데이터를 크롤링하고, MongoDB에 저장한 뒤 이를 기반으로 REST API를 제공하는 백엔드 서버입니다.  
JWT 기반 인증, 검색/필터링/페이지네이션, Swagger를 통한 문서화, JCloud 배포 등을 포함하고 있습니다.

## 주요 기능

- **크롤링**: Saramin에서 채용 정보 크롤링 후 CSV로 저장 및 MongoDB에 Import
- **인증/인가**: JWT 기반 Access/Refresh 토큰
- **회원 관리**: 회원가입, 로그인, 프로필 조회/수정/삭제
- **채용 공고 관리**: 목록 조회, 상세 조회, 검색, 필터링, 정렬, CRUD
- **지원 관리**: 지원하기, 지원 취소, 지원 내역 조회
- **북마크 관리**: 북마크 추가/삭제, 목록 조회
- **통계 제공**: 회사별 공고수, 직무 분야별 공고 분포, 최근 지원 통계
- **API 문서화**: Swagger UI
- **JCloud 배포** 및 pm2 사용으로 백그라운드 실행, 콘솔 종료 후에도 서비스 유지

## 환경

- Node.js: 18.x 이상 권장
- MongoDB: Atlas 또는 로컬 인스턴스
- npm 또는 yarn

## 프로젝트 구조

```plaintext
project-root/
├── src/
│   ├── app.js                 # Express 앱 진입점
│   ├── config/
│   │   └── database.js        # MongoDB 연결 설정
│   ├── controllers/           # 컨트롤러 (auth, jobs, applications 등)
│   ├── middlewares/           # 인증, 에러 핸들러, 유효성 검사 미들웨어
│   ├── models/                # Mongoose 모델 정의 (User, Job, Application 등)
│   ├── routes/                # 라우트 정의 (authRoutes.js, jobRoutes.js 등)
│   ├── services/              # 비즈니스 로직 분리 (authService, jobService 등)
│   ├── utils/                 # 유틸 함수 (CustomError, logger 등)
│   ├── swagger/               # Swagger 설정 파일 (swagger.yaml 등)
│   └── crawler/               # 크롤링 스크립트 (crawler.js), import 스크립트 (import.js)
├── logs/                      # 로그 파일 저장 디렉토리
├── package.json
├── .env                       # 환경 변수 파일
├── .env.example               # 환경 변수 예시 파일
└── README.md

```

## 환경 변수 설정 (.env)
- .env.example을 참고하여 .env 파일을 생성하고 필요한 값을 설정합니다.

   ```
    MONGO_URI="mongodb+srv://Haim:145805@cluster0.o0lvn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    JWT_SECRET="your_jwt_secret"
    JWT_EXPIRES_IN="1h"
    REFRESH_TOKEN_EXPIRES_IN="7d"
    PORT=3000
   ```

## 설치 및 빌드, 실행 방법법

1. 저장소 클론 및 의존성 설치
```bash
git clone https://github.com/HaimLee-4869/goodjob.git
cd project-root (cd goodjob)
npm install
```

2. 빌드 명령어
```bash
npm run build
```

3. 서버 실행
```bash
npm start
또는
node src/app.js
```

4. 생산 환경에서 pm2를 이용해 백그라운드 실행 (Jcloud 서버)
SSH 세션 종료 후에도 서버가 계속 동작.
```bash
sudo npm install -g pm2
pm2 start src/app.js
```

### 크롤링 코드 실행 방법

1. 크롤러 실행 (로컬): saramin_python.csv 파일 생성
```
node src/crawler.js
```

2. CSV->MongoDB Import: 크롤링한 공고 데이터를 MongoDB에 삽입.
```bash
node src/crawler/import.js saramin_python.csv
```


## API 문서

서버 실행 후 브라우저에서 다음 주소로 접속
http://113.198.66.75:13199/api-docs
Swagger UI를 통해 모든 엔드포인트 확인 및 테스트 가능.

### API 엔드포인트 목록 (간단 소개)
### Auth (회원 관련)
| Method | Endpoint | Description |
|--------|----------|------|
| POST | /auth/register | 회원가입 |
| POST | /auth/login | 로그인 |
| GET | /auth/profile | 회원 정보 조회 |
| PUT | /auth/profile | 회원 정보 수정 |
| DELETE | /auth/profile | 회원 탈퇴 |
| POST | /auth/logout | 토큰 갱신 |



### Jobs (채용 공고)
| Method | Endpoint | Description |
|--------|----------|------|
| GET | /jobs | 공고 목록 조회(검색/필터) |
| GET | /jobs/:id | 공고 상세 조회 |
| POST | /jobs | 공고 등록(관리자) |
| PUT | /jobs/:id | 공고 수정(관리자) |
| DELETE | /jobs/:id | 공고 삭제(관리자) |


### Applications (지원)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /applications | 지원하기 |
| GET | /applications | 지원 내역 조회 |
| DELETE | 	/applications/:id | 지원 취소 |

### Bookmarks (북마크)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /bookmarks | 북마크 추가/제거 |
| GET | /bookmarks | 북마크 목록 조회 |


### Stats (통계)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /stats/company-jobs | 회사별 공고 수 조회 |
| GET | /stats/job-sector-distribution | 직무 분야별 공고 분포 조회 |
| GET | 	/stats/recent-applications | 최근 X일간 지원 수 조회 |

### 추가 정보
* 비밀번호: Base64 인코딩하여 저장
* JWT 만료 시간: 1h (Access), 7d (Refresh)
* 페이지네이션: 기본 20개 단위
* 에러 처리: 글로벌 에러 핸들러, 통일된 에러 응답 형식 ({ status: "error", message: "...", code: "..." })

### JCloud 배포 정보
```
Public IP: 113.198.66.75
서버 포트: 3000 내지 13199로 포워딩 (예: http://113.198.66.75:13199)
pm2를 사용하여 pm2 start src/app.js 명령으로 백그라운드 실행
SSH 종료 후에도 서비스 계속 동작
```

### 실행 후 확인 방법
1. http://113.198.66.75:13199/ 접속 시 "Hello World! 백엔드 서버 동작 중" 문구 확인
2. Swagger UI(http://113.198.66.75:13199/api-docs)에서 API 목록 확인 및 테스트
3. 회원가입 후 로그인, 토큰 획득, Authorize 후 보호된 API 요청 가능
