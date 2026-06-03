const FALLBACK_GENRE = "기타";

function normalizeGenres(genres) {
  const normalized = [...new Set((genres || []).map(normalizeGenre).filter(Boolean))];
  return normalized.length > 0 ? normalized : [FALLBACK_GENRE];
}

function normalizeGenre(genre) {
  return String(genre || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function classifyTrackByArtistGenres(track, artist) {
  return {
    track,
    artistId: artist.id,
    artistName: artist.name,
    genres: normalizeGenres(artist.genres)
  };
}

module.exports = {
  FALLBACK_GENRE,
  classifyTrackByArtistGenres,
  normalizeGenres
};
