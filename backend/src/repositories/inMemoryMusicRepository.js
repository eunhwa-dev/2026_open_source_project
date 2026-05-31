class InMemoryMusicRepository {
  constructor() {
    this.likesByUser = new Map();
    this.genrePlaylistsByUser = new Map();
  }

  async saveLikedTrack(userId, track) {
    const likes = getOrCreateMap(this.likesByUser, userId);
    const savedTrack = {
      ...track,
      likedAt: new Date().toISOString()
    };

    likes.set(track.spotifyTrackId, savedTrack);
    return savedTrack;
  }

  async addTrackToGenrePlaylist({ userId, genre, track }) {
    const playlists = getOrCreateMap(this.genrePlaylistsByUser, userId);

    if (!playlists.has(genre)) {
      playlists.set(genre, {
        id: `${userId}:${genre}`,
        name: genre,
        type: "AUTO_GENRE",
        tracks: [],
        updatedAt: new Date().toISOString()
      });
    }

    const playlist = playlists.get(genre);
    const hasTrack = playlist.tracks.some(
      (item) => item.spotifyTrackId === track.spotifyTrackId
    );

    if (!hasTrack) {
      playlist.tracks.push(track);
      playlist.updatedAt = new Date().toISOString();
    }

    return playlist;
  }

  async listGenrePlaylists(userId) {
    return [...(this.genrePlaylistsByUser.get(userId)?.values() || [])];
  }
}

function getOrCreateMap(parentMap, key) {
  if (!parentMap.has(key)) {
    parentMap.set(key, new Map());
  }

  return parentMap.get(key);
}

module.exports = { InMemoryMusicRepository };
