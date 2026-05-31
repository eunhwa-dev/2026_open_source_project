const { asyncHandler } = require("../utils/asyncHandler");

function createPlaylistRoutes({ repository, genrePlaylistService }) {
  const router = require("express").Router({ mergeParams: true });

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

  router.get(
    "/playlists/genres",
    asyncHandler(async (req, res) => {
      const playlists = await repository.listGenrePlaylists(req.params.userId);
      res.json({ playlists });
    })
  );

  return router;
}

module.exports = { createPlaylistRoutes };
