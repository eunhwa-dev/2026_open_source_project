CREATE TABLE users (
  user_id VARCHAR(128) PRIMARY KEY,
  provider VARCHAR(32) NOT NULL,
  google_sub VARCHAR(128),
  email VARCHAR(255) NOT NULL UNIQUE,
  nickname VARCHAR(100) NOT NULL,
  profile_image TEXT,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

CREATE TABLE user_preferences (
  preference_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id VARCHAR(128) NOT NULL,
  favorite_genre VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL,
  UNIQUE (user_id, favorite_genre),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE tracks (
  track_id INTEGER PRIMARY KEY AUTOINCREMENT,
  spotify_track_id VARCHAR(128) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  artist_id VARCHAR(128),
  artist_name VARCHAR(255),
  album_image_url TEXT,
  preview_url TEXT,
  spotify_url TEXT,
  created_at DATETIME NOT NULL
);

CREATE TABLE liked_tracks (
  liked_track_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id VARCHAR(128) NOT NULL,
  spotify_track_id VARCHAR(128) NOT NULL,
  liked_at DATETIME NOT NULL,
  UNIQUE (user_id, spotify_track_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE artist_cache (
  artist_id VARCHAR(128) PRIMARY KEY,
  artist_name VARCHAR(255) NOT NULL,
  genres TEXT NOT NULL,
  updated_at DATETIME NOT NULL
);

CREATE TABLE playlists (
  playlist_id VARCHAR(180) PRIMARY KEY,
  user_id VARCHAR(128) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(32) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE playlist_tracks (
  playlist_track_id INTEGER PRIMARY KEY AUTOINCREMENT,
  playlist_id VARCHAR(180) NOT NULL,
  spotify_track_id VARCHAR(128) NOT NULL,
  added_at DATETIME NOT NULL,
  UNIQUE (playlist_id, spotify_track_id),
  FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id)
);

CREATE TABLE spotify_links (
  link_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id VARCHAR(128) NOT NULL UNIQUE,
  spotify_connected BOOLEAN NOT NULL DEFAULT 0,
  access_token TEXT,
  refresh_token TEXT,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
