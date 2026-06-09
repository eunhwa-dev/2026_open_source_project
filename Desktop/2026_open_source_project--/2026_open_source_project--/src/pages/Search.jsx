import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import useMusicStore from '../store/musicStore'

const BASE_URL = 'http://localhost:4000'

function Search() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('전체')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const [popupSong, setPopupSong] = useState(null)
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 })
  const popupRef = useRef(null)

  const user = JSON.parse(localStorage.getItem('listoraUser') || 'null')
  const { likedTracks, toggleLike, fetchLikedTracks, playTrack, playlists, fetchPlaylists } = useMusicStore()

  const filters = ['전체', '곡', '아티스트', '앨범']
  const manualPlaylists = playlists.filter(p => p.type === 'MANUAL')

  useEffect(() => {
    if (user) {
      fetchLikedTracks()
      fetchPlaylists()
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setPopupSong(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchResults = async (q, currentFilter) => {
    if (!q?.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      if (currentFilter === '아티스트') {
        const res = await axios.get(`${BASE_URL}/api/spotify/search`, {
          params: { q, type: 'artist' }
        })
        const artists = res.data.artists
        setResults(Array.isArray(artists) ? artists : artists?.items || [])
      } else if (currentFilter === '앨범') {
        const res = await axios.get(`${BASE_URL}/api/spotify/search`, {
          params: { q, type: 'album' }
        })
        const albums = res.data.albums
        setResults(Array.isArray(albums) ? albums : albums?.items || [])
      } else {
        const res = await axios.get(`${BASE_URL}/api/spotify/search`, { params: { q } })
        const data = Array.isArray(res.data) ? res.data : res.data.tracks || res.data.items || []
        setResults(data)
      }
    } catch (err) {
      console.error('검색 실패:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (q) => {
    const searchQuery = q || query
    fetchResults(searchQuery, filter)
  }

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      fetchResults(q, '전체')
    }
  }, [searchParams])

  useEffect(() => {
    if (searched && query.trim()) {
      fetchResults(query, filter)
    }
  }, [filter])

  const handleAddToPlaylist = (e, song) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    setPopupPos({ x: rect.left, y: rect.bottom + 8 })
    setPopupSong(popupSong?.spotifyTrackId === song.spotifyTrackId ? null : song)
  }

  const addToPlaylist = async (playlist) => {
    try {
      await axios.post(`${BASE_URL}/api/users/me/playlists/manual/${playlist.id}/tracks`, {
        spotifyTrackId: popupSong.spotifyTrackId,
        title: popupSong.title,
        artistId: popupSong.artistId,
        artistName: popupSong.artistName,
        albumImageUrl: popupSong.albumImageUrl
      })
      await fetchPlaylists()
      setPopupSong(null)
      alert(`"${playlist.name}"에 추가됐어요!`)
    } catch (err) {
      console.error('플레이리스트 추가 실패:', err)
    }
  }

  const getAlbumImage = (album) => {
    if (album.imageUrl) return album.imageUrl
    if (album.images && album.images.length > 0) return album.images[0].url
    return null
  }

  const getArtistImage = (artist) => {
    if (artist.imageUrl) return artist.imageUrl
    if (artist.images && artist.images.length > 0) return artist.images[0].url
    return null
  }

  const renderResults = () => {
    if (!Array.isArray(results)) return null

    if (filter === '아티스트') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
          {results.map((artist, i) => {
            const imageUrl = getArtistImage(artist)
            return (
              <div key={artist.id || i} style={{ textAlign: 'center', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt={artist.name}
                    style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto', display: 'block' }}
                  />
                ) : (
                  <div style={{
                    width: '120px', height: '120px', borderRadius: '50%', background: '#222',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '32px', margin: '0 auto'
                  }}>🎤</div>
                )}
                <div style={{ fontSize: '13px', color: '#fff', marginTop: '8px' }}>{artist.name}</div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>아티스트</div>
              </div>
            )
          })}
        </div>
      )
    }

    if (filter === '앨범') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
          {results.map((album, i) => {
            const imageUrl = getAlbumImage(album)
            const artistName = album.artistName || (album.artists && album.artists.map(a => a.name).join(', '))
            return (
              <div key={album.id || i} style={{ cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt={album.name}
                    style={{ width: '100%', aspectRatio: '1', borderRadius: '8px', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div style={{
                    width: '100%', aspectRatio: '1', background: '#222', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px'
                  }}>💿</div>
                )}
                <div style={{ fontSize: '13px', color: '#fff', marginTop: '8px' }}>{album.name}</div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>
                  {album.release_date && album.release_date.slice(0, 4)} • {artistName}
                </div>
              </div>
            )
          })}
        </div>
      )
    }

    return results.map((song, i) => {
      const isLiked = likedTracks.has(song.spotifyTrackId)
      return (
        <div key={song.spotifyTrackId || i} style={{
          display: 'grid', gridTemplateColumns: user ? '32px 1fr 80px 160px' : '32px 1fr',
          gap: '8px', padding: '10px 12px', borderRadius: '8px',
          alignItems: 'center', cursor: 'pointer', marginBottom: '4px'
        }}
          onClick={() => user && playTrack(song)}
          onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <span style={{ fontSize: '13px', color: '#aaa' }}>{i + 1}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {song.albumImageUrl ? (
              <img src={song.albumImageUrl} alt="앨범" style={{ width: '40px', height: '40px', borderRadius: '4px' }} />
            ) : (
              <div style={{
                width: '40px', height: '40px', background: '#222', borderRadius: '4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', color: '#1DB954'
              }}>♪</div>
            )}
            <div>
              <div style={{ fontSize: '13px', color: '#fff' }}>{song.title}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>{song.artistName}</div>
            </div>
          </div>
          {user && (
            <>
              <span style={{ fontSize: '12px', color: '#aaa' }}>{song.duration}</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={(e) => { e.stopPropagation(); toggleLike(song) }} style={{
                  background: isLiked ? '#1DB954' : 'none',
                  border: '0.5px solid #555', borderRadius: '20px',
                  color: isLiked ? '#000' : '#aaa',
                  fontSize: '11px', padding: '4px 10px', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  {isLiked ? '♥' : '♡'}
                </button>
                <button onClick={(e) => handleAddToPlaylist(e, song)} style={{
                  background: popupSong?.spotifyTrackId === song.spotifyTrackId ? '#a78bfa' : 'none',
                  border: '0.5px solid #555', borderRadius: '20px',
                  color: popupSong?.spotifyTrackId === song.spotifyTrackId ? '#fff' : '#aaa',
                  fontSize: '11px', padding: '4px 10px', cursor: 'pointer'
                }}>+ 플리</button>
                {song.spotifyUrl && (
                  <a href={song.spotifyUrl} target="_blank" rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      background: 'none', border: '0.5px solid #555', borderRadius: '20px',
                      color: '#aaa', fontSize: '11px', padding: '4px 10px', cursor: 'pointer',
                      textDecoration: 'none'
                    }}>🔗</a>
                )}
              </div>
            </>
          )}
        </div>
      )
    })
  }

  return (
    <div style={{ color: '#fff', padding: '24px', position: 'relative' }}>
      <div style={{ fontSize: '11px', color: '#1DB954', letterSpacing: '1px', marginBottom: '6px' }}>
        SEARCH
      </div>
      <div style={{ fontSize: '22px', fontWeight: '500', marginBottom: '20px' }}>음악 검색</div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="곡, 아티스트, 앨범 검색..."
          style={{
            flex: 1, background: '#1a1a1a', border: '0.5px solid #444',
            borderRadius: '8px', padding: '10px 16px', color: '#fff',
            fontSize: '14px', outline: 'none'
          }}
        />
        <button onClick={() => handleSearch()} style={{
          background: '#1DB954', border: 'none', borderRadius: '8px',
          color: '#000', fontSize: '13px', fontWeight: '500',
          padding: '10px 20px', cursor: 'pointer'
        }}>검색</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
            background: filter === f ? '#1DB954' : '#222',
            color: filter === f ? '#000' : '#aaa',
            fontSize: '12px', fontWeight: filter === f ? '500' : '400'
          }}>{f}</button>
        ))}
      </div>

      {loading && (
        <div style={{ color: '#aaa', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>
          검색 중...
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div style={{ color: '#aaa', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>
          검색 결과가 없어요 😢
        </div>
      )}

      {!loading && renderResults()}

      {popupSong && user && (
        <div ref={popupRef} style={{
          position: 'fixed',
          left: popupPos.x,
          top: popupPos.y,
          background: '#1a1a1a',
          border: '0.5px solid #444',
          borderRadius: '10px',
          padding: '8px',
          zIndex: 1000,
          minWidth: '180px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontSize: '11px', color: '#aaa', padding: '4px 8px 8px' }}>플레이리스트에 추가</div>
          {manualPlaylists.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#555', padding: '8px' }}>수동 플레이리스트가 없어요</div>
          ) : (
            manualPlaylists.map(playlist => (
              <div key={playlist.id}
                onClick={() => addToPlaylist(playlist)}
                style={{
                  padding: '8px 10px', borderRadius: '6px', cursor: 'pointer',
                  fontSize: '13px', color: '#fff'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#333'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                {playlist.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Search