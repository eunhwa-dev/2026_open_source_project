const { asyncHandler } = require("../utils/asyncHandler");

function createPlayerRoutes({ repository }) {
  const router = require("express").Router({ mergeParams: true });

  router.get(
    "/",
    asyncHandler(async (req, res) => {
      const player = await repository.getPlayerState(req.params.userId);
      res.json({ player });
    })
  );

  router.post(
    "/play",
    asyncHandler(async (req, res) => {
      const track = resolveTrackPayload(req.body);

      if (track && !isValidTrack(track)) {
        return res.status(400).json({
          message: "spotifyTrackId and title are required when track is provided.",
          code: "INVALID_TRACK_PAYLOAD"
        });
      }

      const player = await repository.playTrack({
        userId: req.params.userId,
        track,
        positionMs: req.body.positionMs
      });

      res.json({ player });
    })
  );

  router.post(
    "/pause",
    asyncHandler(async (req, res) => {
      const player = await repository.pausePlayer(req.params.userId);
      res.json({ player });
    })
  );

  router.post(
    "/stop",
    asyncHandler(async (req, res) => {
      const player = await repository.stopPlayer(req.params.userId);
      res.json({ player });
    })
  );

  router.post(
    "/seek",
    asyncHandler(async (req, res) => {
      const player = await repository.seekPlayer({
        userId: req.params.userId,
        positionMs: req.body.positionMs
      });

      res.json({ player });
    })
  );

  router.patch(
    "/settings",
    asyncHandler(async (req, res) => {
      const player = await repository.updatePlayerSettings(req.params.userId, {
        volumePercent: req.body.volumePercent,
        repeatMode: req.body.repeatMode,
        shuffle: req.body.shuffle
      });

      res.json({ player });
    })
  );

  router.post(
    "/queue",
    asyncHandler(async (req, res) => {
      const track = req.body.track || req.body;

      if (!isValidTrack(track)) {
        return res.status(400).json({
          message: "spotifyTrackId and title are required.",
          code: "INVALID_TRACK_PAYLOAD"
        });
      }

      const player = await repository.enqueueTrack({
        userId: req.params.userId,
        track
      });

      res.status(201).json({ player });
    })
  );

  router.delete(
    "/queue",
    asyncHandler(async (req, res) => {
      const player = await repository.clearPlayerQueue(req.params.userId);
      res.json({ player });
    })
  );

  return router;
}

function isValidTrack(track) {
  return Boolean(track?.spotifyTrackId && track?.title);
}

function resolveTrackPayload(body) {
  if (body.track !== undefined) {
    return body.track || null;
  }

  if (body.spotifyTrackId || body.title) {
    return body;
  }

  return null;
}

module.exports = { createPlayerRoutes };
