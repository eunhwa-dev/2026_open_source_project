const { asyncHandler } = require("../utils/asyncHandler");
const { HttpError } = require("../utils/httpError");

function createPlaylistRoutes({ repository, genrePlaylistService }) {
  const router = require("express").Router({ mergeParams: true });

  router.get(
    "/likes",
    asyncHandler(async (req, res) => {
      const tracks = await repository.listLikedTracks(req.params.userId);
      res.json({
        playlist: {
          id: `${req.params.userId}:liked`,
          name: "좋아요한 곡",
          type: "LIKED",
          tracks
        }
      });
    })
  );

  router.post(
    "/likes",
    asyncHandler(async (req, res) => {
      const track = req.body;

      if (!track.spotifyTrackId || !track.title || !track.artistId) {
        return res.status(400).json({
          message: "spotifyTrackId, title, artistId는 필수입니다.",
          code: "INVALID_TRACK_PAYLOAD"
        });
      }

      const result = await genrePlaylistService.likeTrackAndSync({
        userId: req.params.userId,
        track
      });

      res.status(201).json(result);
    })
  );

  router.delete(
    "/likes/:spotifyTrackId",
    asyncHandler(async (req, res) => {
      const removedTrack = await repository.removeLikedTrack(
        req.params.userId,
        req.params.spotifyTrackId
      );

      if (!removedTrack) {
        throw new HttpError("좋아요한 곡을 찾을 수 없습니다.", 404, {
          code: "LIKED_TRACK_NOT_FOUND"
        });
      }

      res.json({
        removedTrack,
        playlists: await repository.listGenrePlaylists(req.params.userId)
      });
    })
  );

  router.get(
    "/playlists",
    asyncHandler(async (req, res) => {
      const likedTracks = await repository.listLikedTracks(req.params.userId);
      const genrePlaylists = await repository.listGenrePlaylists(req.params.userId);
      const manualPlaylists = await repository.listManualPlaylists(req.params.userId);

      res.json({
        playlists: [
          {
            id: `${req.params.userId}:liked`,
            name: "좋아요한 곡",
            type: "LIKED",
            tracks: likedTracks
          },
          ...genrePlaylists,
          ...manualPlaylists
        ]
      });
    })
  );

  router.get(
    "/playlists/genres",
    asyncHandler(async (req, res) => {
      const playlists = await repository.listGenrePlaylists(req.params.userId);
      res.json({ playlists });
    })
  );

  router.get(
    "/playlists/manual",
    asyncHandler(async (req, res) => {
      const playlists = await repository.listManualPlaylists(req.params.userId);
      res.json({ playlists });
    })
  );

  router.post(
    "/playlists/manual",
    asyncHandler(async (req, res) => {
      if (!String(req.body.name || "").trim()) {
        return res.status(400).json({
          message: "플레이리스트 이름은 필수입니다.",
          code: "PLAYLIST_NAME_REQUIRED"
        });
      }

      const playlist = await repository.createManualPlaylist(req.params.userId, {
        name: req.body.name
      });

      res.status(201).json({ playlist });
    })
  );

  router.get(
    "/playlists/manual/:playlistId",
    asyncHandler(async (req, res) => {
      const playlist = await repository.getManualPlaylist(
        req.params.userId,
        req.params.playlistId
      );

      if (!playlist) {
        throw new HttpError("수동 플레이리스트를 찾을 수 없습니다.", 404, {
          code: "MANUAL_PLAYLIST_NOT_FOUND"
        });
      }

      res.json({ playlist });
    })
  );

  router.delete(
    "/playlists/manual/:playlistId",
    asyncHandler(async (req, res) => {
      const playlist = await repository.deleteManualPlaylist(
        req.params.userId,
        req.params.playlistId
      );

      if (!playlist) {
        throw new HttpError("수동 플레이리스트를 찾을 수 없습니다.", 404, {
          code: "MANUAL_PLAYLIST_NOT_FOUND"
        });
      }

      res.json({ deletedPlaylist: playlist });
    })
  );

  router.post(
    "/playlists/manual/:playlistId/tracks",
    asyncHandler(async (req, res) => {
      const track = req.body;

      if (!track.spotifyTrackId || !track.title) {
        return res.status(400).json({
          message: "spotifyTrackId, title은 필수입니다.",
          code: "INVALID_TRACK_PAYLOAD"
        });
      }

      const playlist = await repository.addTrackToManualPlaylist({
        userId: req.params.userId,
        playlistId: req.params.playlistId,
        track
      });

      if (!playlist) {
        throw new HttpError("수동 플레이리스트를 찾을 수 없습니다.", 404, {
          code: "MANUAL_PLAYLIST_NOT_FOUND"
        });
      }

      res.status(201).json({ playlist });
    })
  );

  router.delete(
    "/playlists/manual/:playlistId/tracks/:spotifyTrackId",
    asyncHandler(async (req, res) => {
      const playlist = await repository.removeTrackFromManualPlaylist({
        userId: req.params.userId,
        playlistId: req.params.playlistId,
        spotifyTrackId: req.params.spotifyTrackId
      });

      if (!playlist) {
        throw new HttpError("수동 플레이리스트를 찾을 수 없습니다.", 404, {
          code: "MANUAL_PLAYLIST_NOT_FOUND"
        });
      }

      res.json({ playlist });
    })
  );

  return router;
}

module.exports = { createPlaylistRoutes };
