class InMemoryMusicRepository {
  constructor() {
    this.usersById = new Map();
    this.userIdsByEmail = new Map();
    this.likesByUser = new Map();
    this.genrePlaylistsByUser = new Map();
    this.manualPlaylistsByUser = new Map();
  }

  async upsertUserFromGoogleProfile(profile) {
    const normalizedEmail = normalizeEmail(profile.email);
    const existingId =
      profile.userId ||
      (normalizedEmail ? this.userIdsByEmail.get(normalizedEmail) : null);
    const userId = existingId || createUserId(profile);
    const existingUser = this.usersById.get(userId);
    const now = new Date().toISOString();

    const user = {
      userId,
      provider: "google",
      googleSub: profile.googleSub || profile.sub || existingUser?.googleSub || null,
      email: normalizedEmail || existingUser?.email || null,
      nickname:
        profile.nickname ||
        profile.name ||
        existingUser?.nickname ||
        normalizedEmail?.split("@")[0] ||
        "user",
      profileImage:
        profile.profileImage ||
        profile.picture ||
        existingUser?.profileImage ||
        null,
      favoriteGenres: existingUser?.favoriteGenres || [],
      createdAt: existingUser?.createdAt || now,
      updatedAt: now
    };

    this.usersById.set(userId, user);
    if (user.email) {
      this.userIdsByEmail.set(user.email, userId);
    }

    return {
      user: clone(user),
      isNewUser: !existingUser
    };
  }

  async getUser(userId) {
    return clone(this.usersById.get(userId) || null);
  }

  async updateUserProfile(userId, updates) {
    const user = this.usersById.get(userId);
    if (!user) {
      return null;
    }

    if (updates.nickname !== undefined) {
      user.nickname = String(updates.nickname || "").trim() || user.nickname;
    }

    if (updates.profileImage !== undefined) {
      user.profileImage = updates.profileImage || null;
    }

    user.updatedAt = new Date().toISOString();
    return clone(user);
  }

  async updateUserPreferences(userId, favoriteGenres) {
    const user = this.usersById.get(userId);
    if (!user) {
      return null;
    }

    user.favoriteGenres = normalizeGenres(favoriteGenres);
    user.updatedAt = new Date().toISOString();
    return clone(user);
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

  async listLikedTracks(userId) {
    return [...(this.likesByUser.get(userId)?.values() || [])].map(clone);
  }

  async removeLikedTrack(userId, spotifyTrackId) {
    const likes = this.likesByUser.get(userId);
    const removed = likes?.get(spotifyTrackId) || null;

    if (!removed) {
      return null;
    }

    likes.delete(spotifyTrackId);
    removeTrackFromPlaylists(this.genrePlaylistsByUser.get(userId), spotifyTrackId);
    removeTrackFromPlaylists(this.manualPlaylistsByUser.get(userId), spotifyTrackId);
    return clone(removed);
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
    return [...(this.genrePlaylistsByUser.get(userId)?.values() || [])].map(clone);
  }

  async createManualPlaylist(userId, { name }) {
    const playlists = getOrCreateMap(this.manualPlaylistsByUser, userId);
    const now = new Date().toISOString();
    const playlist = {
      id: `manual:${userId}:${slugify(name)}:${Date.now()}`,
      userId,
      name: String(name || "").trim(),
      type: "MANUAL",
      tracks: [],
      createdAt: now,
      updatedAt: now
    };

    playlists.set(playlist.id, playlist);
    return clone(playlist);
  }

  async listManualPlaylists(userId) {
    return [...(this.manualPlaylistsByUser.get(userId)?.values() || [])].map(clone);
  }

  async getManualPlaylist(userId, playlistId) {
    return clone(this.manualPlaylistsByUser.get(userId)?.get(playlistId) || null);
  }

  async addTrackToManualPlaylist({ userId, playlistId, track }) {
    const playlist = this.manualPlaylistsByUser.get(userId)?.get(playlistId);
    if (!playlist) {
      return null;
    }

    const hasTrack = playlist.tracks.some(
      (item) => item.spotifyTrackId === track.spotifyTrackId
    );

    if (!hasTrack) {
      playlist.tracks.push({
        ...track,
        addedAt: new Date().toISOString()
      });
      playlist.updatedAt = new Date().toISOString();
    }

    return clone(playlist);
  }

  async removeTrackFromManualPlaylist({ userId, playlistId, spotifyTrackId }) {
    const playlist = this.manualPlaylistsByUser.get(userId)?.get(playlistId);
    if (!playlist) {
      return null;
    }

    const originalLength = playlist.tracks.length;
    playlist.tracks = playlist.tracks.filter(
      (track) => track.spotifyTrackId !== spotifyTrackId
    );

    if (playlist.tracks.length !== originalLength) {
      playlist.updatedAt = new Date().toISOString();
    }

    return clone(playlist);
  }

  async deleteManualPlaylist(userId, playlistId) {
    const playlists = this.manualPlaylistsByUser.get(userId);
    const playlist = playlists?.get(playlistId) || null;

    if (!playlist) {
      return null;
    }

    playlists.delete(playlistId);
    return clone(playlist);
  }

  async getUserSummary(userId) {
    const user = await this.getUser(userId);
    const likedTracks = await this.listLikedTracks(userId);
    const genrePlaylists = await this.listGenrePlaylists(userId);
    const manualPlaylists = await this.listManualPlaylists(userId);

    return {
      user,
      stats: {
        likedTrackCount: likedTracks.length,
        genrePlaylistCount: genrePlaylists.length,
        manualPlaylistCount: manualPlaylists.length,
        playlistCount: 1 + genrePlaylists.length + manualPlaylists.length,
        favoriteGenreCount: user?.favoriteGenres?.length || 0
      },
      spotifyConnected: false,
      recentPlaylists: [...genrePlaylists, ...manualPlaylists]
        .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
        .slice(0, 5)
    };
  }
}

function getOrCreateMap(parentMap, key) {
  if (!parentMap.has(key)) {
    parentMap.set(key, new Map());
  }

  return parentMap.get(key);
}

function createUserId(profile) {
  if (profile.googleSub || profile.sub) {
    return `google:${profile.googleSub || profile.sub}`;
  }

  if (profile.email) {
    return `email:${normalizeEmail(profile.email)}`;
  }

  return `user:${Date.now()}`;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase() || null;
}

function normalizeGenres(genres) {
  return [
    ...new Set(
      (Array.isArray(genres) ? genres : [])
        .map((genre) => String(genre || "").trim())
        .filter(Boolean)
    )
  ];
}

function slugify(value) {
  return String(value || "playlist")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "playlist";
}

function removeTrackFromPlaylists(playlists, spotifyTrackId) {
  if (!playlists) {
    return;
  }

  for (const playlist of playlists.values()) {
    const originalLength = playlist.tracks.length;
    playlist.tracks = playlist.tracks.filter(
      (track) => track.spotifyTrackId !== spotifyTrackId
    );

    if (playlist.tracks.length !== originalLength) {
      playlist.updatedAt = new Date().toISOString();
    }
  }
}

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

module.exports = { InMemoryMusicRepository };
