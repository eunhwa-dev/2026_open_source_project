# Backend: User Playlist and Spotify Genre Service

제안서의 백엔드 1, 백엔드 2 범위를 같은 Express 서버에서 통합하기 위한 백엔드 모듈입니다.

- 백엔드 1: Google 로그인 연동, 회원 관리 API, 사용자/좋아요/플레이리스트 DB 설계
- 백엔드 2: Spotify API 연동, 아티스트 장르 조회, 다중 장르 분류, 자동 플레이리스트 생성 및 동기화

## 실행

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

`.env`에는 다음 값을 설정합니다.

- `GOOGLE_CLIENT_ID`: Google OAuth 클라이언트 ID
- `ALLOW_DEV_AUTH`: 개발 중 프로필 객체 기반 로그인을 허용하려면 `true`
- `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`: Spotify for Developers에서 발급받은 값

## 주요 API

- `GET /health`: 서버 상태 확인
- `POST /api/auth/google`: Google ID 토큰 기반 로그인/회원 생성
- `GET /api/users/:userId/profile`: 사용자 프로필, 통계, 최근 플레이리스트 조회
- `PATCH /api/users/:userId/profile`: 닉네임/프로필 이미지 수정
- `GET /api/users/:userId/preferences`: 선호 장르 조회
- `PUT /api/users/:userId/preferences`: 선호 장르 저장
- `GET /api/spotify/search?q=keyword&type=track&limit=10`: Spotify 검색
- `GET /api/spotify/artists/:artistId/genres`: 아티스트 장르 조회
- `GET /api/users/:userId/likes`: `좋아요한 곡` 기본 플레이리스트 조회
- `POST /api/users/:userId/likes`: 좋아요 저장 후 장르별 자동 플레이리스트 동기화
- `DELETE /api/users/:userId/likes/:spotifyTrackId`: 좋아요 해제 및 플레이리스트 반영
- `GET /api/users/:userId/playlists`: 좋아요/자동/수동 플레이리스트 통합 조회
- `GET /api/users/:userId/playlists/genres`: 자동 생성된 장르 플레이리스트 목록
- `GET /api/users/:userId/playlists/manual`: 수동 플레이리스트 목록
- `POST /api/users/:userId/playlists/manual`: 수동 플레이리스트 생성
- `POST /api/users/:userId/playlists/manual/:playlistId/tracks`: 수동 플레이리스트에 곡 추가
- `DELETE /api/users/:userId/playlists/manual/:playlistId/tracks/:spotifyTrackId`: 수동 플레이리스트에서 곡 삭제

## Google 로그인 요청 예시

실제 연동에서는 프론트엔드가 Google Identity Services에서 받은 ID 토큰을 전달합니다.

```json
{
  "idToken": "google-id-token"
}
```

로컬 개발 중에는 `ALLOW_DEV_AUTH=true`일 때 다음처럼 프로필 객체로 흐름을 검증할 수 있습니다.

```json
{
  "profile": {
    "sub": "google-user-id",
    "email": "user@example.com",
    "name": "사용자",
    "picture": "https://example.com/profile.png"
  }
}
```

## 선호 장르 요청 예시

```json
{
  "favoriteGenres": ["K-Pop", "R&B", "Jazz"]
}
```

## 좋아요 요청 예시

```json
{
  "spotifyTrackId": "track-id",
  "title": "Song title",
  "artistId": "artist-id",
  "artistName": "Artist name",
  "albumImageUrl": "https://example.com/cover.jpg",
  "spotifyUrl": "https://open.spotify.com/track/track-id"
}
```

아티스트 장르가 여러 개면 각 장르 플레이리스트에 모두 추가합니다. 장르가 없으면 `기타` 플레이리스트로 분류합니다.

## 수동 플레이리스트 생성 예시

```json
{
  "name": "공부할 때"
}
```

## DB 설계

`db/schema.sql`에 제안서 엔티티 기준의 관계형 DB 스키마 초안을 정리했습니다. 현재 런타임은 통합 개발 편의를 위해 메모리 저장소를 사용하며, 실제 SQLite/MySQL 연결 시 같은 repository 메서드를 구현하는 저장소로 교체하면 됩니다.
