# Backend 2: Spotify Genre Playlist Service

제안서의 `백엔드 2` 담당 범위인 Spotify API 연동, 아티스트 장르 조회, 다중 장르 분류, 자동 플레이리스트 생성 및 동기화 로직을 구현한 백엔드 모듈입니다.

## 실행

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

`.env`에는 Spotify for Developers에서 발급받은 `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` 값을 넣어야 합니다.

## 주요 API

- `GET /health`: 서버 상태 확인
- `GET /api/spotify/search?q=keyword&type=track&limit=10`: Spotify 검색
- `GET /api/spotify/artists/:artistId/genres`: 아티스트 장르 조회
- `POST /api/users/:userId/likes`: 좋아요 저장 후 장르별 자동 플레이리스트 동기화
- `GET /api/users/:userId/playlists/genres`: 자동 생성된 장르 플레이리스트 목록

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
