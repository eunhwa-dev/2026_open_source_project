import { useEffect } from 'react'
import useMusicStore from '../store/musicStore'

function LikedSongs() {
  const { likedSongs, fetchLikedTracks, toggleLike } = useMusicStore()

  useEffect(() => {
    fetchLikedTracks()
  }, [])

  return (
    <div style={{ color: '#fff' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '20px',
        padding: '24px', background: '#1a1035', marginBottom: '8px'
      }}>
        <div style={{
          width: '140px', height: '140px', background: '#2d1f6e',
          borderRadius: '8px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '52px', color: '#a78bfa'
        }}>♥</div>
        <div>
          <div style={{ fontSize: '11px', color: '#a78bfa', marginBottom: '6px', letterSpacing: '1px' }}>MY LIBRARY</div>
          <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>좋아요한 곡</div>
          <div style={{ fontSize: '13px', color: '#aaa' }}>나 • {likedSongs.length}곡</div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
          <button style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: '#a78bfa', border: 'none', color: '#fff',
            fontSize: '18px', cursor: 'pointer'
          }}>▶</button>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '32px 1fr 100px 50px',
          gap: '8px', padding: '8px 12px', borderBottom: '0.5px solid #333',
          fontSize: '11px', color: '#aaa', marginBottom: '4px'
        }}>
          <span>#</span><span>제목</span><span>추가한 날짜</span><span>⏱</span>
        </div>

        {likedSongs.length === 0 && (
          <div style={{ color: '#aaa', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>
            좋아요한 곡이 없어요 😢
          </div>
        )}

        {likedSongs.map((song, i) => (
          <div key={song.spotifyTrackId || i} style={{
            display: 'grid', gridTemplateColumns: '32px 1fr 100px 50px',
            gap: '8px', padding: '10px 12px', borderRadius: '6px', alignItems: 'center', cursor: 'pointer'
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a1035'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <span style={{ fontSize: '13px', color: '#aaa' }}>{i + 1}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {song.albumImageUrl ? (
                <img src={song.albumImageUrl} alt="앨범"
                  style={{ width: '36px', height: '36px', borderRadius: '4px', flexShrink: 0 }} />
              ) : (
                <div style={{
                  width: '36px', height: '36px', background: '#2d1f6e',
                  borderRadius: '4px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', color: '#a78bfa'
                }}>♪</div>
              )}
              <div>
                <div style={{ fontSize: '13px', color: '#fff' }}>{song.title}</div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>{song.artistName}</div>
              </div>
            </div>
            <span style={{ fontSize: '12px', color: '#aaa' }}>{song.duration || '-'}</span>
            <button onClick={() => toggleLike(song)} style={{
              background: 'none', border: 'none', color: '#a78bfa',
              fontSize: '16px', cursor: 'pointer'
            }}>♥</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LikedSongs