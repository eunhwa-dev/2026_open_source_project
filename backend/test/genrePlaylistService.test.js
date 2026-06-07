const assert = require("node:assert/strict");
const test = require("node:test");

const { InMemoryMusicRepository } = require("../src/repositories/inMemoryMusicRepository");
const { GenrePlaylistService } = require("../src/services/genrePlaylistService");

test("syncs liked track into all artist genre playlists without duplicates", async () => {
  const repository = new InMemoryMusicRepository();
  const spotifyClient = {
    async getArtist() {
      return {
        id: "artist-1",
        name: "Artist",
        genres: ["pop", "k-pop"]
      };
    }
  };
  const service = new GenrePlaylistService({ repository, spotifyClient });
  const track = {
    spotifyTrackId: "track-1",
    title: "Song",
    artistId: "artist-1",
    artistName: "Artist"
  };

  await service.likeTrackAndSync({ userId: "user-1", track });
  await service.likeTrackAndSync({ userId: "user-1", track });

  const playlists = await repository.listGenrePlaylists("user-1");

  assert.equal(playlists.length, 2);
  assert.deepEqual(
    playlists.map((playlist) => playlist.name).sort(),
    ["k-pop", "pop"]
  );
  assert.equal(playlists[0].tracks.length, 1);
  assert.equal(playlists[1].tracks.length, 1);
});

test("enriches liked track details from Spotify track API before saving", async () => {
  const repository = new InMemoryMusicRepository();
  const spotifyClient = {
    async getTrack() {
      return {
        spotifyTrackId: "track-1",
        title: "Song",
        artistId: "artist-1",
        artistName: "Artist",
        albumImageUrl: "https://example.com/cover.png",
        previewUrl: "https://example.com/preview.mp3",
        spotifyUrl: "https://open.spotify.com/track/track-1"
      };
    },
    async getArtist() {
      return {
        id: "artist-1",
        name: "Artist",
        genres: ["pop"]
      };
    }
  };
  const service = new GenrePlaylistService({ repository, spotifyClient });

  await service.likeTrackAndSync({
    userId: "user-1",
    track: {
      spotifyTrackId: "track-1",
      title: "Song",
      artistId: "artist-1"
    }
  });

  const likedTracks = await repository.listLikedTracks("user-1");

  assert.equal(likedTracks[0].artistName, "Artist");
  assert.equal(likedTracks[0].albumImageUrl, "https://example.com/cover.png");
  assert.equal(likedTracks[0].spotifyUrl, "https://open.spotify.com/track/track-1");
});
