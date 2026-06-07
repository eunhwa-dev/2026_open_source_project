const { classifyTrackByArtistGenres } = require("./genreClassifier");

class GenrePlaylistService {
  constructor({ repository, spotifyClient }) {
    this.repository = repository;
    this.spotifyClient = spotifyClient;
  }

  async likeTrackAndSync({ userId, track }) {
    const enrichedTrack = await this.enrichTrack(track);
    const savedTrack = await this.repository.saveLikedTrack(userId, enrichedTrack);
    const artist = await this.spotifyClient.getArtist(savedTrack.artistId);
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

  async enrichTrack(track) {
    if (!this.spotifyClient.getTrack || !track.spotifyTrackId) {
      return track;
    }

    const spotifyTrack = await this.spotifyClient.getTrack(track.spotifyTrackId);

    return {
      ...spotifyTrack,
      ...track,
      title: track.title || spotifyTrack.title,
      artistId: track.artistId || spotifyTrack.artistId,
      artistName: track.artistName || spotifyTrack.artistName,
      albumImageUrl: track.albumImageUrl || spotifyTrack.albumImageUrl,
      previewUrl: track.previewUrl || spotifyTrack.previewUrl,
      spotifyUrl: track.spotifyUrl || spotifyTrack.spotifyUrl
    };
  }
}

module.exports = { GenrePlaylistService };
