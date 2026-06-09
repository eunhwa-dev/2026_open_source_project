import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import useMusicStore from '../store/musicStore'

const BASE_URL = 'http://localhost:4000'

function PlaylistDetail() {
  const { type, name } = useParams()
  const isAuto = type === 'auto'
  const decodedName = decodeURIComponent(name)

  const { playlists, fetchPlaylists } = useMusicStore()
  const [sortBy, setSortBy] = useState('default')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const playlist = playlists.find(p => p.name === decodedName)
  const playlistId = playlist?.id
  const songs = playlist?.tracks || []

  const sorted = [...songs].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    if (sortBy === 'artist') return (a.artistName || '').localeCompare(b.artistName || '')
    return 0
  })

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await axios.get(`${BASE_URL}/api/spotify/search`, {
        params: { q: searchQuery }
      })
      const data = Array.isArray(res.data) ? res.data : res.data.tracks || []
      setSearchResults(data)
    } catch (err) {
      console.error('검색 실패:', err)
    } finally {
      setSearching(false)
    }
  }

  const addTrack = async (song) => {
    if (!playlistId) return
    try {
      await axios.post(`${BASE_URL}/api/users/me/playlists/manual/${playlistId}/tracks`, {
        spotifyTrackId: song.spotifyTrackId,
        title: song.title,
        artistId: song.artistId,
        artistName: song.artistName,
        albumImageUrl: song.albumImageUrl
      })
      await fetchPlaylists()
      setSearchResults([])
      setSearchQuery('')
    } catch (err) {
      console.error('곡 추가 실패:', err)
    }
  }

  const deleteTrack = async (spotifyTrackId) => {
    if (!playlistId) return
    try {
      await axios.delete(`${BASE_URL}/api/users/me/playlists/manual/${playlistId}/tracks/${spotifyTrackId}`)
      await fetchPlaylists()
    } catch (err) {
      console.error('곡 삭제 실패:', err)
    }
  }

  return (
    <div style={{ color: '#fff', padding: '24px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '20px',
        padding: '20px', background: isAuto ? '#0f2d1f' : '#1a1035',
        borderRadius: '10px', marginBottom: '20px'
      }}>
        <div style={{
          width: '100px', height: '100px', borderRadius: '8px',
          background: isAuto ? '#1DB954' : '#a78bfa',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px'
        }}>♪</div>
        <div>
          <div style={{
            display: 'inline-block', fontSize: '10px',
            background: isAuto ? '#0f3d20' : '#2d1f6e',
            color: isAuto ? '#1DB954' : '#a78bfa',
            padding: '3px 10px', borderRadius: '20px', marginBottom: '8px'
          }}>
            {isAuto ? '자동 생성' : '수동 생성'}
          </div>
          <div style={{ fontSize: '22px', fontWeight: '500', marginBottom: '4px' }}>
            {decodedName}
          </div>
          <div style={{ fontSize: '12px', color: '#aaa' }}>{songs.length}곡</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <button style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: isAuto ? '#1DB954' : '#a78bfa',
          border: 'none', color: '#fff', fontSize: '16px', cursor: 'pointer'
        }}>▶</button>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
          background: '#222', border: '0.5px solid #444', borderRadius: '20px',
          color: '#fff', fontSize: '12px', padding: '6px 14px', cursor: 'pointer', outline: 'none'
        }}>
          <option value="default">정렬: 기본</option>
          <option value="title">정렬: 제목순</option>
          <option value="artist">정렬: 아티스트순</option>
        </select>
      </div>

      {!isAuto && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="곡 제목 입력 후 Enter"
              style={{
                flex: 1, background: '#1a1a1a', border: '0.5px solid #444',
                borderRadius: '8px', padding: '8px 14px', color: '#fff',
                fontSize: '13px', outline: 'none'
              }}
            />
            <button onClick={handleSearch} style={{
              background: '#a78bfa', border: 'none', borderRadius: '8px',
              color: '#fff', fontSize: '12px', padding: '8px 16px', cursor: 'pointer'
            }}>검색</button>
          </div>

          {searching && (
            <div style={{ color: '#aaa', fontSize: '13px', padding: '8px' }}>검색 중...</div>
          )}

          {searchResults.length > 0 && (
            <div style={{
              background: '#1a1a1a', borderRadius: '8px',
              border: '0.5px solid #333', overflow: 'hidden', marginBottom: '8px'
            }}>
              {searchResults.map((song, i) => (
                <div key={song.spotifyTrackId || i} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', borderBottom: '0.5px solid #222',
                  cursor: 'pointer'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#222'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  {song.albumImageUrl ? (
                    <img src={song.albumImageUrl} alt="앨범"
                      style={{ width: '36px', height: '36px', borderRadius: '4px', flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: '36px', height: '36px', background: '#333', borderRadius: '4px', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px'
                    }}>♪</div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', color: '#fff' }}>{song.title}</div>
                    <div style={{ fontSize: '11px', color: '#aaa' }}>{song.artistName}</div>
                  </div>
                  <button onClick={() => addTrack(song)} style={{
                    background: '#a78bfa', border: 'none', borderRadius: '20px',
                    color: '#fff', fontSize: '11px', padding: '4px 12px', cursor: 'pointer'
                  }}>+ 추가</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{
        display: 'grid', gridTemplateColumns: '32px 1fr 80px 40px',
        gap: '8px', padding: '8px 12px', borderBottom: '0.5px solid #333',
        fontSize: '11px', color: '#aaa', marginBottom: '4px'
      }}>
        <span>#</span><span>제목</span><span>시간</span><span></span>
      </div>

      {sorted.length === 0 && (
        <div style={{ color: '#aaa', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>
          곡이 없어요 😢
        </div>
      )}

      {sorted.map((song, i) => (
        <div key={song.spotifyTrackId || i} style={{
          display: 'grid', gridTemplateColumns: '32px 1fr 80px 40px',
          gap: '8px', padding: '10px 12px', borderRadius: '6px',
          alignItems: 'center', cursor: 'pointer'
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <span style={{ fontSize: '13px', color: '#aaa' }}>{i + 1}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {song.albumImageUrl ? (
              <img src={song.albumImageUrl} alt="앨범"
                style={{ width: '36px', height: '36px', borderRadius: '4px', flexShrink: 0 }} />
            ) : (
              <div style={{
                width: '36px', height: '36px', flexShrink: 0, borderRadius: '4px',
                background: isAuto ? '#0f3d20' : '#2d1f6e',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', color: isAuto ? '#1DB954' : '#a78bfa'
              }}>♪</div>
            )}
            <div>
              <div style={{ fontSize: '13px', color: '#fff' }}>{song.title}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>{song.artistName || '-'}</div>
            </div>
          </div>
          <span style={{ fontSize: '12px', color: '#aaa' }}>{song.duration || '-'}</span>
          {!isAuto && (
            <button onClick={() => deleteTrack(song.spotifyTrackId)} style={{
              background: 'none', border: 'none', color: '#555',
              fontSize: '14px', cursor: 'pointer'
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#ff4444'}
              onMouseLeave={e => e.currentTarget.style.color = '#555'}
            >✕</button>
          )}
        </div>
      ))}
    </div>
  )
}

export default PlaylistDetail