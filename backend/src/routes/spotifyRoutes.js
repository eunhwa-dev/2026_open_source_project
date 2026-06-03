const { asyncHandler } = require("../utils/asyncHandler");

function createSpotifyRoutes({ spotifyClient }) {
  const router = require("express").Router();

  router.get(
    "/search",
    asyncHandler(async (req, res) => {
      const { q, type = "track", limit = "10" } = req.query;

      if (!q || !q.trim()) {
        return res.status(400).json({
          message: "검색어 q는 필수입니다.",
          code: "QUERY_REQUIRED"
        });
      }

      const results = await spotifyClient.search({
        query: q.trim(),
        type,
        limit: Number(limit)
      });

      res.json(results);
    })
  );

  router.get(
    "/artists/:artistId/genres",
    asyncHandler(async (req, res) => {
      const artist = await spotifyClient.getArtist(req.params.artistId);
      res.json({
        artistId: artist.id,
        name: artist.name,
        genres: artist.genres || []
      });
    })
  );

  return router;
}

module.exports = { createSpotifyRoutes };
