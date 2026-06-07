import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useMusicStore from '../store/musicStore'

function PlaylistDetail() {
  const { type, name } = useParams()
  const isAuto = type === 'auto'
  const decodedName = decodeURIComponent(name)

  const { playlists, fetchPlaylists } = useMusicStore()
  const [sortBy, setSortBy] = useState('default')
  const [newSong, setNewSong] = useState('')

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const playlist = playlists.find(p => p.name === decodedName)
  const songs = playlist?.tracks || []

  const sorted = [...songs].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    if (sortBy === 'artist') return (a.artistName || '').localeCompare(b.artistName || '')
    return 0
  })

  const addSong = () => {
    if (!newSong.trim()) return
    setNewSong('')
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
        <button style={{
          background: 'none', border: '0.5px solid #555', borderRadius: '20px',
          color: '#fff', fontSize: '12px', padding: '6px 14px', cursor: 'pointer'
        }}>🔗 외부 링크</button>
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
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            value={newSong}
            onChange={e => setNewSong(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSong()}
            placeholder="곡 제목 입력 후 Enter"
            style={{
              flex: 1, background: '#1a1a1a', border: '0.5px solid #444',
              borderRadius: '8px', padding: '8px 14px', color: '#fff',
              fontSize: '13px', outline: 'none'
            }}
          />
          <button onClick={addSong} style={{
            background: '#a78bfa', border: 'none', borderRadius: '8px',
            color: '#fff', fontSize: '12px', padding: '8px 16px', cursor: 'pointer'
          }}>+ 추가</button>
        </div>
      )}

      <div style={{
        display: 'grid', gridTemplateColumns: '32px 1fr 80px',
        gap: '8px', padding: '8px 12px', borderBottom: '0.5px solid #333',
        fontSize: '11px', color: '#aaa', marginBottom: '4px'
      }}>
        <span>#</span><span>제목</span><span>시간</span>
      </div>

      {sorted.length === 0 && (
        <div style={{ color: '#aaa', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>
          곡이 없어요 😢
        </div>
      )}

      {sorted.map((song, i) => (
        <div key={song.spotifyTrackId || i} style={{
          display: 'grid', gridTemplateColumns: '32px 1fr 80px',
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
        </div>
      ))}
    </div>
  )
}

export default PlaylistDetail