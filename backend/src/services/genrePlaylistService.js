const { classifyTrackByArtistGenres } = require("./genreClassifier");

class GenrePlaylistService {
  constructor({ repository, spotifyClient }) {
    this.repository = repository;
    this.spotifyClient = spotifyClient;
  }

  async likeTrackAndSync({ userId, track }) {
    const savedTrack = await this.repository.saveLikedTrack(userId, track);
    const artist = await this.spotifyClient.getArtist(track.artistId);
    const classification = classifyTrackByArtistGenres(savedTrack, artist);
    const playlists = [];

    for (const genre of classification.genres) {
      const playlist = await this.repository.addTrackToGenrePlaylist({
        userId,
        genre,
        track: savedTrack
      });
      playlists.push(playlist);
    }

    return {
      likedTrack: savedTrack,
      classification,
      syncedPlaylists: playlists
    };
  }
}

module.exports = { GenrePlaylistService };
