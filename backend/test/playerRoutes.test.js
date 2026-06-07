const assert = require("node:assert/strict");
const test = require("node:test");

const { createApp } = require("../src/app");

test("manages player bar state without Spotify playback side effects", async () => {
  const app = createApp();
  const server = app.listen(0);
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const playerPath = "/api/users/user-1/player";

  try {
    const initial = await requestJson(baseUrl, playerPath);
    assert.equal(initial.status, 200);
    assert.equal(initial.body.player.isPlaying, false);
    assert.equal(initial.body.player.currentTrack, null);
    assert.equal(initial.body.player.volumePercent, 70);

    const track = {
      spotifyTrackId: "track-1",
      title: "Song",
      artistName: "Artist",
      albumImageUrl: "https://example.com/cover.png",
      spotifyUrl: "https://open.spotify.com/track/track-1"
    };

    const play = await requestJson(baseUrl, `${playerPath}/play`, {
      method: "POST",
      body: { track, positionMs: 1200 }
    });
    assert.equal(play.status, 200);
    assert.equal(play.body.player.isPlaying, true);
    assert.equal(play.body.player.currentTrack.spotifyTrackId, "track-1");
    assert.equal(play.body.player.positionMs, 1200);

    const seek = await requestJson(baseUrl, `${playerPath}/seek`, {
      method: "POST",
      body: { positionMs: 5000 }
    });
    assert.equal(seek.body.player.positionMs, 5000);

    const settings = await requestJson(baseUrl, `${playerPath}/settings`, {
      method: "PATCH",
      body: { volumePercent: 130, repeatMode: "track", shuffle: true }
    });
    assert.equal(settings.body.player.volumePercent, 100);
    assert.equal(settings.body.player.repeatMode, "track");
    assert.equal(settings.body.player.shuffle, true);

    const queue = await requestJson(baseUrl, `${playerPath}/queue`, {
      method: "POST",
      body: {
        spotifyTrackId: "track-2",
        title: "Next Song"
      }
    });
    assert.equal(queue.status, 201);
    assert.equal(queue.body.player.queue.length, 1);

    const pause = await requestJson(baseUrl, `${playerPath}/pause`, {
      method: "POST"
    });
    assert.equal(pause.body.player.isPlaying, false);

    const stop = await requestJson(baseUrl, `${playerPath}/stop`, {
      method: "POST"
    });
    assert.equal(stop.body.player.isPlaying, false);
    assert.equal(stop.body.player.positionMs, 0);
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
