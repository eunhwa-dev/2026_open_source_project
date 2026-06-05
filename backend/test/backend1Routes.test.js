const assert = require("node:assert/strict");
const test = require("node:test");

const { createApp } = require("../src/app");

test("handles google login, preferences, profile summary, and manual playlists", async () => {
  const app = createApp({
    googleAuthService: {
      async resolveProfile() {
        return {
          googleSub: "sub-1",
          email: "ksh@example.com",
          nickname: "KSH",
          profileImage: "https://example.com/profile.png"
        };
      }
    }
  });
  const server = app.listen(0);
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  try {
    const login = await requestJson(baseUrl, "/api/auth/google", {
      method: "POST",
      body: { idToken: "test-token" }
    });

    assert.equal(login.status, 201);
    assert.equal(login.body.user.userId, "google:sub-1");
    assert.equal(login.body.needsPreferences, true);

    const userPath = `/api/users/${encodeURIComponent(login.body.user.userId)}`;
    const preferences = await requestJson(baseUrl, `${userPath}/preferences`, {
      method: "PUT",
      body: { favoriteGenres: ["K-Pop", "R&B", "K-Pop"] }
    });

    assert.deepEqual(preferences.body.favoriteGenres, ["K-Pop", "R&B"]);

    const createdPlaylist = await requestJson(
      baseUrl,
      `${userPath}/playlists/manual`,
      {
        method: "POST",
        body: { name: "공부할 때" }
      }
    );

    assert.equal(createdPlaylist.status, 201);
    assert.equal(createdPlaylist.body.playlist.type, "MANUAL");

    const playlistPath = `${userPath}/playlists/manual/${encodeURIComponent(
      createdPlaylist.body.playlist.id
    )}`;
    const track = {
      spotifyTrackId: "track-1",
      title: "Song",
      artistId: "artist-1",
      artistName: "Artist"
    };

    await requestJson(baseUrl, `${playlistPath}/tracks`, {
      method: "POST",
      body: track
    });
    const duplicateAdd = await requestJson(baseUrl, `${playlistPath}/tracks`, {
      method: "POST",
      body: track
    });

    assert.equal(duplicateAdd.body.playlist.tracks.length, 1);

    const profile = await requestJson(baseUrl, `${userPath}/profile`);
    assert.equal(profile.body.stats.manualPlaylistCount, 1);
    assert.equal(profile.body.stats.favoriteGenreCount, 2);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

async function requestJson(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json"
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const body = await response.json();

  return {
    status: response.status,
    body
  };
}
