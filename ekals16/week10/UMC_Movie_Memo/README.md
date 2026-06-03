# UMC Movie Memo

TMDB Search API를 사용해 영화를 검색하는 React + TypeScript + Vite 프로젝트입니다.

## 1) 실행 방법

1. 패키지 설치

```bash
pnpm install
```

2. 환경 변수 설정

```bash
cp .env.example .env
```

.env 파일에서 아래 값을 실제 TMDB v4 Access Token으로 교체합니다.

```bash
VITE_TMDB_ACCESS_TOKEN=your_tmdb_v4_access_token_here
```

3. 개발 서버 실행

```bash
pnpm dev
```

## 2) 주요 기능

- 영화 제목 기반 검색
- 언어 선택
- 성인 콘텐츠 포함 여부 선택
- 개봉 연도(primary_release_year), 지역(region) 필터
- 포스터, 평점, 개봉일, 줄거리 카드 표시

## 3) 사용 API

- Endpoint: `GET /3/search/movie`
- 문서: [TMDB Search Movie](https://developer.themoviedb.org/reference/search-movie)

## 4) Vercel SPA 라우팅

새로고침 404를 막기 위해 프로젝트 루트의 [vercel.json](vercel.json) 에 아래 `rewrites` 설정이 들어 있습니다.

```json
{
	"rewrites": [
		{
			"source": "/(.*)",
			"destination": "/index.html"
		}
	]
}
```
