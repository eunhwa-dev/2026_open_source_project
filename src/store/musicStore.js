import { create } from 'zustand'
import axios from 'axios'

const BASE_URL = 'http://localhost:4000'

const useMusicStore = create((set, get) => ({
  likedTracks: new Set(),
  likedSongs: [],
  playlists: [],

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