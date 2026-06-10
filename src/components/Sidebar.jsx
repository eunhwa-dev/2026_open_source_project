import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import useMusicStore from '../store/musicStore'

const BASE_URL = 'http://localhost:4000'

function Sidebar() {
  const location = useLocation()
  const [playlistOpen, setPlaylistOpen] = useState(true)
  const [autoOpen, setAutoOpen] = useState(false)
  const [manualOpen, setManualOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')

  const { playlists, fetchPlaylists } = useMusicStore()

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const autoPlaylists = playlists.filter(p => p.type === 'AUTO_GENRE')
  const manualPlaylists = playlists.filter(p => p.type === 'MANUAL')

  const createPlaylist = async () => {
    if (!newName.trim()) return
    try {
      await axios.post(`${BASE_URL}/api/users/me/playlists/manual`, { name: newName })
      await fetchPlaylists()
      setNewName('')
      setCreating(false)
    } catch (err) {
      console.error('플레이리스트 생성 실패:', err)
    }
  }

  return (
    <div style={{
      width: '200px', background: '#000', padding: '16px 12px',
      display: 'flex', flexDirection: 'column', gap: '2px',
      borderRight: '0.5px solid #222', height: '100%',
      overflowY: 'auto'
    }}>
      <div style={{ fontSize: '10px', color: '#555', padding: '8px 10px 8px', letterSpacing: '1px' }}>
        MENU
      </div>

      <Link to="/liked" style={{
        fontSize: '12px', textDecoration: 'none',
        color: location.pathname === '/liked' ? '#fff' : '#aaa',
        background: location.pathname === '/liked' ? '#222' : 'none',
        padding: '8px 10px', borderRadius: '6px'
      }}>좋아요한 곡</Link>

      <div onClick={() => setPlaylistOpen(!playlistOpen)} style={{
        fontSize: '12px', color: '#aaa', padding: '8px 10px',
        borderRadius: '6px', cursor: 'pointer', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span>플레이리스트</span>
        <span style={{ fontSize: '10px' }}>{playlistOpen ? '▼' : '▶'}</span>
      </div>

      {playlistOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '8px' }}>

          {/* 자동 플레이리스트 */}
          <div onClick={() => setAutoOpen(!autoOpen)} style={{
            fontSize: '11px', color: '#aaa', padding: '6px 10px',
            borderRadius: '6px', cursor: 'pointer', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center',
            borderLeft: '1px solid #333'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '9px', color: '#1DB954' }}>●</span>
              자동 플레이리스트
            </div>
            <span style={{ fontSize: '9px' }}>{autoOpen ? '▼' : '▶'}</span>
          </div>

          {autoOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', paddingLeft: '16px' }}>
              {autoPlaylists.length === 0 ? (
                <div style={{ fontSize: '11px', color: '#555', padding: '5px 10px' }}>없음</div>
              ) : (
                autoPlaylists.map(playlist => (
                  <Link
                    key={playlist.id}
                    to={`/playlist/auto/${encodeURIComponent(playlist.name)}`}
                    style={{
                      fontSize: '11px', textDecoration: 'none', color: '#777',
                      padding: '5px 10px', borderRadius: '6px',
                      borderLeft: '1px solid #222', display: 'block'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#777'}
                  >{playlist.name}</Link>
                ))
              )}
            </div>
          )}

          {/* 수동 플레이리스트 */}
          <div style={{
            fontSize: '11px', color: '#aaa', padding: '6px 10px',
            borderRadius: '6px', cursor: 'pointer', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center',
            borderLeft: '1px solid #333'
          }}>
            <div onClick={() => setManualOpen(!manualOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
              <span style={{ fontSize: '9px', color: '#aaa' }}>●</span>
              수동 플레이리스트
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span
                onClick={(e) => { e.stopPropagation(); setCreating(!creating); setManualOpen(true) }}
                style={{ fontSize: '14px', color: '#aaa', cursor: 'pointer', lineHeight: 1 }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#aaa'}
              >+</span>
              <span onClick={() => setManualOpen(!manualOpen)} style={{ fontSize: '9px' }}>
                {manualOpen ? '▼' : '▶'}
              </span>
            </div>
          </div>

          {manualOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', paddingLeft: '16px' }}>
              {creating && (
                <div style={{ display: 'flex', gap: '4px', padding: '4px 0' }}>
                  <input
                    autoFocus
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') createPlaylist()
                      if (e.key === 'Escape') { setCreating(false); setNewName('') }
                    }}
                    placeholder="이름 입력..."
                    style={{
                      flex: 1, background: '#1a1a1a', border: '0.5px solid #444',
                      borderRadius: '4px', padding: '4px 8px', color: '#fff',
                      fontSize: '11px', outline: 'none'
                    }}
                  />
                  <button onClick={createPlaylist} style={{
                    background: '#1DB954', border: 'none', borderRadius: '4px',
                    color: '#000', fontSize: '11px', padding: '4px 6px', cursor: 'pointer'
                  }}>✓</button>
                </div>
              )}
              {manualPlaylists.length === 0 && !creating ? (
                <div style={{ fontSize: '11px', color: '#555', padding: '5px 10px' }}>없음</div>
              ) : (
                manualPlaylists.map(playlist => (
                  <Link
                    key={playlist.id}
                    to={`/playlist/manual/${encodeURIComponent(playlist.name)}`}
                    style={{
                      fontSize: '11px', textDecoration: 'none', color: '#777',
                      padding: '5px 10px', borderRadius: '6px',
                      borderLeft: '1px solid #222', display: 'block'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#777'}
                  >{playlist.name}</Link>
                ))
              )}
            </div>
          )}

        </div>
      )}
    </div>
  )
}

export default Sidebar