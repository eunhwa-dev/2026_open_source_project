import { create } from 'zustand'
import axios from 'axios'

const BASE_URL = 'http://localhost:4000'

const useMusicStore = create((set, get) => ({
  // 좋아요
  likedTracks: new Set(),
  likedSongs: [],

  // 플레이리스트
  playlists: [],

  // 플레이어
  player: {
    currentTrack: null,
    isPlaying: false,
    positionMs: 0,
    volumePercent: 70,
    repeatMode: 'off',
    shuffle: false,
    queue: []
  },

  fetchLikedTracks: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/users/me/likes`)
      const tracks = res.data.playlist?.tracks || []
      const ids = new Set(tracks.map(t => t.spotifyTrackId))
      set({ likedTracks: ids, likedSongs: tracks })
    } catch (err) {
      console.error('좋아요 목록 불러오기 실패:', err)
    }
  },

  fetchPlaylists: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/users/me/playlists`)
      set({ playlists: res.data.playlists || [] })
    } catch (err) {
      console.error('플레이리스트 불러오기 실패:', err)
    }
  },

  fetchPlayer: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/users/me/player`)
      set({ player: res.data.player })
    } catch (err) {
      console.error('플레이어 상태 불러오기 실패:', err)
    }
  },

  playTrack: async (song) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/users/me/player/play`, {
        spotifyTrackId: song.spotifyTrackId,
        title: song.title,
        artistName: song.artistName,
        albumImageUrl: song.albumImageUrl,
        previewUrl: song.previewUrl
      })
      set({ player: res.data.player })
    } catch (err) {
      console.error('재생 실패:', err)
    }
  },

  pauseTrack: async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/users/me/player/pause`)
      set({ player: res.data.player })
    } catch (err) {
      console.error('일시정지 실패:', err)
    }
  },

  setVolume: async (volumePercent) => {
    try {
      const res = await axios.patch(`${BASE_URL}/api/users/me/player/settings`, { volumePercent })
      set({ player: res.data.player })
    } catch (err) {
      console.error('볼륨 설정 실패:', err)
    }
  },

  toggleLike: async (song) => {
    const { likedTracks, likedSongs } = get()
    const isLiked = likedTracks.has(song.spotifyTrackId)
    try {
      if (isLiked) {
        await axios.delete(`${BASE_URL}/api/users/me/likes/${song.spotifyTrackId}`)
        const next = new Set(likedTracks)
        next.delete(song.spotifyTrackId)
        set({
          likedTracks: next,
          likedSongs: likedSongs.filter(s => s.spotifyTrackId !== song.spotifyTrackId)
        })
      } else {
        await axios.post(`${BASE_URL}/api/users/me/likes`, {
          spotifyTrackId: song.spotifyTrackId,
          title: song.title,
          artistId: song.artistId
        })
        const next = new Set(likedTracks)
        next.add(song.spotifyTrackId)
        set({
          likedTracks: next,
          likedSongs: [...likedSongs, song]
        })
      }
    } catch (err) {
      console.error('좋아요 실패:', err)
    }
  }
}))

export default useMusicStore