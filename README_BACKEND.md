# Backend Implementation Guide

이 문서는 `backend-ksh` 브랜치에 구현된 백엔드 기능을 정리합니다.

## 구현 범위

### 백엔드 1

- Google 로그인 연동 API
- 회원 생성/조회/수정 API
- 사용자 선호 장르 저장/조회 API
- 좋아요한 곡 목록 조회 및 해제 API
- 수동 플레이리스트 생성/조회/삭제 API
- 수동 플레이리스트 곡 추가/삭제 API
- 마이페이지 요약 데이터 API
- 사용자, 선호 장르, 트랙, 좋아요, 플레이리스트 DB 스키마 초안

### 백엔드 2 통합

- Spotify 검색 API
- Spotify 아티스트 장르 조회 API
- 좋아요 저장 후 아티스트 장르 기반 자동 분류
- 장르별 자동 플레이리스트 생성 및 동기화
- 복수 장르 아티스트 처리
- 장르 정보가 없는 경우 `기타` 플레이리스트 처리
- 같은 플레이리스트 내 중복 곡 삽입 방지

## 실행 방법

```bash
cd backend
npm install
npm run dev
```

기본 서버 주소:

```text
http://localhost:4000
```

상태 확인:

```http
GET /health
```

응답:

```json
{
  "ok": true
}
```

## 환경변수

`backend/.env` 파일을 생성하고 다음 값을 설정합니다.

```env
PORT=4000
GOOGLE_CLIENT_ID=your_google_oauth_client_id
ALLOW_DEV_AUTH=true
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

설명:

- `GOOGLE_CLIENT_ID`: Google Cloud Console에서 발급한 OAuth Client ID
- `ALLOW_DEV_AUTH`: 개발 중 profile 객체 기반 로그인 허용 여부
- `SPOTIFY_CLIENT_ID`: Spotify for Developers Client ID
- `SPOTIFY_CLIENT_SECRET`: Spotify for Developers Client Secret

주의:

- `backend/.env`는 Git에 포함하지 않습니다.
- 프론트엔드에서 Google 로그인 버튼을 사용하려면 루트 `.env.local`에도 `VITE_GOOGLE_CLIENT_ID`를 설정합니다.

## API 목록

### Auth

#### Google 로그인

```http
POST /api/auth/google
```

실제 Google 로그인 요청:

```json
{
  "idToken": "google-id-token"
}
```

개발용 요청:

`ALLOW_DEV_AUTH=true`일 때만 사용할 수 있습니다.

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

응답:

```json
{
  "user": {
    "userId": "google:google-user-id",
    "provider": "google",
    "googleSub": "google-user-id",
    "email": "user@example.com",
    "nickname": "사용자",
    "profileImage": "https://example.com/profile.png",
    "favoriteGenres": [],
    "createdAt": "2026-06-05T00:00:00.000Z",
    "updatedAt": "2026-06-05T00:00:00.000Z"
  },
  "isNewUser": true,
  "needsPreferences": true
}
```

### User

#### 사용자 프로필/마이페이지 요약 조회

```http
GET /api/users/:userId/profile
```

응답:

```json
{
  "user": {
    "userId": "google:google-user-id",
    "email": "user@example.com",
    "nickname": "사용자",
    "profileImage": null,
    "favoriteGenres": ["K-Pop", "R&B"]
  },
  "stats": {
    "likedTrackCount": 3,
    "genrePlaylistCount": 2,
    "manualPlaylistCount": 1,
    "playlistCount": 4,
    "favoriteGenreCount": 2
  },
  "spotifyConnected": false,
  "recentPlaylists": []
}
```

#### 사용자 프로필 수정

```http
PATCH /api/users/:userId/profile
```

요청:

```json
{
  "nickname": "새 닉네임",
  "profileImage": "https://example.com/profile.png"
}
```

#### 선호 장르 조회

```http
GET /api/users/:userId/preferences
```

#### 선호 장르 저장

```http
PUT /api/users/:userId/preferences
```

요청:

```json
{
  "favoriteGenres": ["K-Pop", "R&B", "Jazz"]
}
```

### Spotify

#### 음악 검색

```http
GET /api/spotify/search?q=keyword&type=track&limit=10
```

응답:

```json
{
  "tracks": [
    {
      "spotifyTrackId": "track-id",
      "title": "Song title",
      "artistId": "artist-id",
      "artistName": "Artist name",
      "albumImageUrl": "https://example.com/cover.jpg",
      "previewUrl": null,
      "spotifyUrl": "https://open.spotify.com/track/track-id"
    }
  ]
}
```

#### 아티스트 장르 조회

```http
GET /api/spotify/artists/:artistId/genres
```

응답:

```json
{
  "artistId": "artist-id",
  "name": "Artist name",
  "genres": ["k-pop", "dance pop"]
}
```

### Likes

#### 좋아요한 곡 목록 조회

```http
GET /api/users/:userId/likes
```

응답:

```json
{
  "playlist": {
    "id": "google:google-user-id:liked",
    "name": "좋아요한 곡",
    "type": "LIKED",
    "tracks": []
  }
}
```

#### 좋아요 저장 및 자동 장르 분류

```http
POST /api/users/:userId/likes
```

요청:

```json
{
  "spotifyTrackId": "track-id",
  "title": "Song title",
  "artistId": "artist-id",
  "artistName": "Artist name",
  "albumImageUrl": "https://example.com/cover.jpg",
  "previewUrl": null,
  "spotifyUrl": "https://open.spotify.com/track/track-id"
}
```

처리 흐름:

1. 사용자 좋아요 목록에 곡 저장
2. Spotify Artist API로 대표 아티스트 장르 조회
3. 장르별 자동 플레이리스트 생성 또는 갱신
4. 복수 장르일 경우 모든 장르 플레이리스트에 추가
5. 장르 정보가 없으면 `기타` 플레이리스트에 추가

#### 좋아요 해제

```http
DELETE /api/users/:userId/likes/:spotifyTrackId
```

좋아요 목록에서 곡을 제거하고, 장르별/수동 플레이리스트에서도 해당 곡을 제거합니다.

### Playlists

#### 전체 플레이리스트 조회

```http
GET /api/users/:userId/playlists
```

`좋아요한 곡`, 자동 장르 플레이리스트, 수동 플레이리스트를 함께 반환합니다.

#### 자동 장르 플레이리스트 조회

```http
GET /api/users/:userId/playlists/genres
```

#### 수동 플레이리스트 목록 조회

```http
GET /api/users/:userId/playlists/manual
```

#### 수동 플레이리스트 생성

```http
POST /api/users/:userId/playlists/manual
```

요청:

```json
{
  "name": "공부할 때"
}
```

#### 수동 플레이리스트 상세 조회

```http
GET /api/users/:userId/playlists/manual/:playlistId
```

#### 수동 플레이리스트 삭제

```http
DELETE /api/users/:userId/playlists/manual/:playlistId
```

#### 수동 플레이리스트에 곡 추가

```http
POST /api/users/:userId/playlists/manual/:playlistId/tracks
```

요청:

```json
{
  "spotifyTrackId": "track-id",
  "title": "Song title",
  "artistId": "artist-id",
  "artistName": "Artist name",
  "albumImageUrl": "https://example.com/cover.jpg",
  "previewUrl": null,
  "spotifyUrl": "https://open.spotify.com/track/track-id"
}
```

#### 수동 플레이리스트에서 곡 삭제

```http
DELETE /api/users/:userId/playlists/manual/:playlistId/tracks/:spotifyTrackId
```

## 저장소 구조

현재 런타임은 `InMemoryMusicRepository`를 사용합니다.

```text
backend/src/repositories/inMemoryMusicRepository.js
```

특징:

- 서버 실행 중에만 데이터 유지
- 서버를 재시작하면 사용자, 좋아요, 플레이리스트 데이터가 초기화됨
- 통합 개발과 API 흐름 검증에 적합

실제 DB 전환을 위한 스키마 초안은 다음 파일에 있습니다.

```text
backend/db/schema.sql
```

포함 테이블:

- `users`
- `user_preferences`
- `tracks`
- `liked_tracks`
- `artist_cache`
- `playlists`
- `playlist_tracks`
- `spotify_links`

## 프론트엔드 연동 포인트

Google 로그인 성공 후 프론트엔드는 다음 값을 저장합니다.

```js
localStorage.setItem('listoraUser', JSON.stringify(data.user))
localStorage.setItem('listoraUserId', data.user.userId)
```

이후 API 호출 시 `test-user` 같은 임시 ID 대신 `localStorage.getItem('listoraUserId')` 값을 사용해야 합니다.

예:

```js
const userId = localStorage.getItem('listoraUserId')
fetch(`http://127.0.0.1:4000/api/users/${encodeURIComponent(userId)}/likes`)
```

## 테스트

```bash
cd backend
npm test
```

현재 테스트:

- Google 로그인, 선호 장르, 마이페이지 요약, 수동 플레이리스트 라우트 테스트
- 장르 정규화 테스트
- 장르 정보가 없을 때 `기타` 처리 테스트
- 복수 장르 분류 테스트
- 좋아요 곡을 장르별 플레이리스트에 중복 없이 동기화하는 테스트

성공 기준:

```text
tests 5
pass 5
fail 0
```

## 남은 작업

- 메모리 저장소를 SQLite 또는 MySQL 저장소로 교체
- 프론트 검색/좋아요 화면에서 로그인 사용자 ID 사용
- 좋아요 목록 화면을 실제 API와 연결
- 마이페이지를 실제 API와 연결
- 수동 플레이리스트 화면을 실제 API와 연결
- Google OAuth 테스트 사용자 및 Authorized JavaScript origins 설정 확인
- Spotify Client ID/Secret 설정 후 실제 검색/장르 분류 시연
