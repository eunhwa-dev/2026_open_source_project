const FALLBACK_GENRE = "기타";

const ARTIST_GENRE_OVERRIDES = new Map([
  ["bts", ["k-pop", "pop"]],
  ["newjeans", ["k-pop", "dance pop"]],
  ["blackpink", ["k-pop", "dance pop"]],
  ["twice", ["k-pop", "dance pop"]],
  ["seventeen", ["k-pop", "pop"]],
  ["stray kids", ["k-pop", "hip-hop"]],
  ["iu", ["k-pop", "ballad"]],
  ["taylor swift", ["pop"]],
  ["the weeknd", ["pop", "r&b"]],
  ["ed sheeran", ["pop"]],
  ["adele", ["pop", "soul"]],
  ["bruno mars", ["pop", "funk"]],
  ["billie eilish", ["alt-pop", "electropop"]],
  ["ariana grande", ["pop", "r&b"]],
  ["justin bieber", ["pop"]],
  ["drake", ["hip-hop", "rap"]],
  ["kendrick lamar", ["hip-hop", "rap"]],
  ["eminem", ["hip-hop", "rap"]],
  ["coldplay", ["rock", "pop"]],
  ["queen", ["rock"]],
  ["radiohead", ["alternative rock"]],
  ["laufey", ["jazz", "pop"]],
]);

const KEYWORD_GENRE_RULES = [
  { pattern: /\bk[-\s]?pop\b|케이팝/i, genres: ["k-pop"] },
  { pattern: /\br&b\b|알앤비/i, genres: ["r&b"] },
  { pattern: /\bhip[-\s]?hop\b|\brap\b|힙합/i, genres: ["hip-hop"] },
  { pattern: /\bjazz\b|재즈/i, genres: ["jazz"] },
  { pattern: /\brock\b|락/i, genres: ["rock"] },
  { pattern: /\bindie\b|인디/i, genres: ["indie"] },
  { pattern: /\bedm\b|\bdance\b|electro|일렉/i, genres: ["edm"] },
  { pattern: /\bballad\b|발라드/i, genres: ["ballad"] },
  { pattern: /\bclassical\b|classic|클래식|mozart|beethoven|bach/i, genres: ["classical"] },
  { pattern: /\blo[-\s]?fi\b/i, genres: ["lo-fi"] },
  { pattern: /\bsoul\b/i, genres: ["soul"] },
  { pattern: /\bfunk\b/i, genres: ["funk"] },
  { pattern: /\bpop\b/i, genres: ["pop"] },
];

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
  const spotifyGenres = normalizeGenres(artist.genres);
  const genres =
    spotifyGenres[0] === FALLBACK_GENRE
      ? inferGenresFromTrackAndArtist(track, artist)
      : spotifyGenres;

  return {
    track,
    artistId: artist.id,
    artistName: artist.name,
    genres
  };
}

function inferGenresFromTrackAndArtist(track, artist) {
  const artistName = normalizeLookupText(artist.name || track.artistName);
  const overrideGenres = ARTIST_GENRE_OVERRIDES.get(artistName);

  if (overrideGenres) {
    return normalizeGenres(overrideGenres);
  }

  const searchableText = [
    artist.name,
    track.artistName,
    track.title,
    track.albumName
  ].filter(Boolean).join(" ");

  const inferredGenres = [];
  for (const rule of KEYWORD_GENRE_RULES) {
    if (rule.pattern.test(searchableText)) {
      inferredGenres.push(...rule.genres);
    }
  }

  return normalizeGenres(inferredGenres);
}

function normalizeLookupText(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

module.exports = {
  FALLBACK_GENRE,
  classifyTrackByArtistGenres,
  inferGenresFromTrackAndArtist,
  normalizeGenres
};
