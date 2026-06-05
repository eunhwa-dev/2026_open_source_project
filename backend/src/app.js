const cors = require("cors");
const express = require("express");

const { createAuthRoutes } = require("./routes/authRoutes");
const { createSpotifyRoutes } = require("./routes/spotifyRoutes");
const { createPlaylistRoutes } = require("./routes/playlistRoutes");
const { createUserRoutes } = require("./routes/userRoutes");
const { SpotifyClient } = require("./services/spotifyClient");
const { GenrePlaylistService } = require("./services/genrePlaylistService");
const { GoogleAuthService } = require("./services/googleAuthService");
const { InMemoryMusicRepository } = require("./repositories/inMemoryMusicRepository");

function createApp(dependencies = {}) {
  const app = express();
  const repository = dependencies.repository || new InMemoryMusicRepository();
  const spotifyClient = dependencies.spotifyClient || new SpotifyClient();
  const googleAuthService =
    dependencies.googleAuthService || new GoogleAuthService();
  const genrePlaylistService =
    dependencies.genrePlaylistService ||
    new GenrePlaylistService({ repository, spotifyClient });

  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/spotify", createSpotifyRoutes({ spotifyClient }));
  app.use("/api/auth", createAuthRoutes({ repository, googleAuthService }));
  app.use("/api/users/:userId", createUserRoutes({ repository }));
  app.use(
    "/api/users/:userId",
    createPlaylistRoutes({ repository, genrePlaylistService })
  );

  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({
      message: err.message || "Internal server error",
      code: err.code || "INTERNAL_ERROR"
    });
  });

  return app;
}

module.exports = { createApp };
