const { HttpError } = require("../utils/httpError");

class SpotifyClient {
  constructor(options = {}) {
    this.clientId = options.clientId || process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret =
      options.clientSecret || process.env.SPOTIFY_CLIENT_SECRET;
    this.fetch = options.fetch || global.fetch;
    this.accessToken = null;
    this.expiresAt = 0;
    this.baseUrl = options.baseUrl || "https://api.spotify.com/v1";
  }

  async search({ query, type = "track", limit = 10 }) {
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const params = new URLSearchParams({
      q: query,
      type,
      limit: String(safeLimit)
    });

    const data = await this.request(`/search?${params.toString()}`);

    if (type === "track") {
      return {
        tracks: (data.tracks?.items || []).map(mapTrack)
      };
    }

    if (type === "artist") {
      return {
        artists: (data.artists?.items || []).map(mapArtist)
      };
    }

    return data;
  }

  async getArtist(artistId) {
    const artist = await this.request(`/artists/${artistId}`);
    return mapArtist(artist);
  }

  async getTrack(trackId) {
    const track = await this.request(`/tracks/${encodeURIComponent(trackId)}`);
    return mapTrack(track);
  }

  async getArtists(artistIds) {
    const uniqueIds = [...new Set(artistIds)].filter(Boolean);
    if (uniqueIds.length === 0) {
      return [];
    }

    const params = new URLSearchParams({ ids: uniqueIds.slice(0, 50).join(",") });
    const data = await this.request(`/artists?${params.toString()}`);
    return (data.artists || []).map(mapArtist);
  }

  async request(path) {
    const token = await this.getAccessToken();
    const response = await this.fetch(`${this.baseUrl}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new HttpError("Spotify API 요청에 실패했습니다.", response.status, {
        code: "SPOTIFY_API_ERROR"
      });
    }

    return response.json();
  }

  async getAccessToken() {
    if (this.accessToken && Date.now() < this.expiresAt) {
      return this.accessToken;
    }

    if (!this.clientId || !this.clientSecret) {
      throw new HttpError("Spotify API 인증 정보가 설정되지 않았습니다.", 500, {
        code: "SPOTIFY_CREDENTIALS_MISSING"
      });
    }

    const credentials = Buffer.from(
      `${this.clientId}:${this.clientSecret}`
    ).toString("base64");

    const response = await this.fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({ grant_type: "client_credentials" })
    });

    if (!response.ok) {
      throw new HttpError("Spotify 토큰 발급에 실패했습니다.", response.status, {
        code: "SPOTIFY_TOKEN_ERROR"
      });
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.expiresAt = Date.now() + (data.expires_in - 60) * 1000;
    return this.accessToken;
  }
}

function mapTrack(track) {
  const primaryArtist = track.artists?.[0] || {};

  return {
    spotifyTrackId: track.id,
    title: track.name,
    artistId: primaryArtist.id,
    artistName: primaryArtist.name,
    albumImageUrl: track.album?.images?.[0]?.url || null,
    previewUrl: track.preview_url || null,
    spotifyUrl: track.external_urls?.spotify || null
  };
}

function mapArtist(artist) {
  return {
    id: artist.id,
    name: artist.name,
    genres: artist.genres || [],
    spotifyUrl: artist.external_urls?.spotify || null,
    imageUrl: artist.images?.[0]?.url || null
  };
}

module.exports = { SpotifyClient, mapTrack, mapArtist };
