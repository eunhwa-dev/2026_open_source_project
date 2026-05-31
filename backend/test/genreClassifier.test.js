const assert = require("node:assert/strict");
const test = require("node:test");

const {
  FALLBACK_GENRE,
  classifyTrackByArtistGenres,
  normalizeGenres
} = require("../src/services/genreClassifier");

test("normalizes duplicated genre names", () => {
  assert.deepEqual(normalizeGenres(["K-Pop", " k-pop ", "Dance Pop"]), [
    "k-pop",
    "dance pop"
  ]);
});

test("uses fallback genre when Spotify artist has no genres", () => {
  assert.deepEqual(normalizeGenres([]), [FALLBACK_GENRE]);
});

test("classifies one track into every artist genre", () => {
  const result = classifyTrackByArtistGenres(
    { spotifyTrackId: "track-1", title: "Sample" },
    { id: "artist-1", name: "Artist", genres: ["pop", "r&b"] }
  );

  assert.deepEqual(result.genres, ["pop", "r&b"]);
  assert.equal(result.artistId, "artist-1");
});
