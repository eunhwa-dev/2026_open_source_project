import { useState } from 'react'

function Playlist() {
  const [activeTab, setActiveTab] = useState('auto')

  const autoPlaylists = [
    { id: 1, name: 'K-Pop', count: 32, updated: '오늘' },
    { id: 2, name: 'Indie Pop', count: 18, updated: '오늘' },
    { id: 3, name: 'Jazz', count: 11, updated: '오늘' },
    { id: 4, name: 'R&B', count: 14, updated: '오늘' },
    { id: 5, name: 'Synthpop', count: 9, updated: '오늘' },
    { id: 6, name: '기타', count: 7, updated: '오늘' },
  ]

  const manualPlaylists = [
    { id: 1, name: '내가 만든 플레이리스트 1', count: 12, updated: '3일 전' },
    { id: 2, name: '드라이브 할 때', count: 8, updated: '1주 전' },
    { id: 3, name: '공부할 때', count: 15, updated: '2주 전' },
  ]

  const playlists = activeTab === 'auto' ? autoPlaylists : manualPlaylists

  return (
    <div style={{ color: '#fff', padding: '24px' }}>

      <div style={{ fontSize: '11px', color: '#1DB954', letterSpacing: '1px', marginBottom: '6px' }}>
        PLAYLISTS
      </div>
      <div style={{ fontSize: '22px', fontWeight: '500', marginBottom: '20px' }}>플레이리스트</div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('auto')}
          style={{
            padding: '8px 20px', borderRadius: '20px', border: 'none',
            background: activeTab === 'auto' ? '#1DB954' : '#222',
            color: activeTab === 'auto' ? '#000' : '#aaa',
            fontSize: '13px', cursor: 'pointer', fontWeight: activeTab === 'auto' ? '500' : '400'
          }}>
          자동 생성
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          style={{
            padding: '8px 20px', borderRadius: '20px', border: 'none',
            background: activeTab === 'manual' ? '#1DB954' : '#222',
            color: activeTab === 'manual' ? '#000' : '#aaa',
            fontSize: '13px', cursor: 'pointer', fontWeight: activeTab === 'manual' ? '500' : '400'
          }}>
          수동 생성
        </button>
      </div>

      {activeTab === 'auto' && (
        <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '16px' }}>
          좋아요한 곡의 아티스트 장르 기준으로 자동 분류된 플레이리스트입니다
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {playlists.map(playlist => (
          <div key={playlist.id} style={{
            background: '#1a1a1a', border: '0.5px solid #333',
            borderRadius: '10px', padding: '14px', cursor: 'pointer'
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#222'}
            onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}
          >
            <div style={{
              width: '100%', height: '80px', background: '#333',
              borderRadius: '8px', marginBottom: '10px'
            }} />
            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>{playlist.name}</div>
            <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '8px' }}>수록 곡 {playlist.count}곡</div>
            {activeTab === 'auto' && (
              <div style={{
                display: 'inline-block', background: '#0f3d20', color: '#1DB954',
                fontSize: '10px', padding: '3px 8px', borderRadius: '20px', marginBottom: '6px'
              }}>자동 생성</div>
            )}
            <div style={{ fontSize: '10px', color: '#555', marginBottom: '10px' }}>
              최근 업데이트 {playlist.updated}
            </div>
            <button style={{
              width: '100%', background: '#222', border: '0.5px solid #444',
              borderRadius: '6px', color: '#fff', fontSize: '12px',
              padding: '7px', cursor: 'pointer'
            }}>
              플레이리스트 보기
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Playlist