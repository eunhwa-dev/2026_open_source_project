import { useEffect } from 'react'
import useMusicStore from '../store/musicStore'

function MyPage() {
  const { likedSongs, playlists, fetchLikedTracks, fetchPlaylists } = useMusicStore()

  useEffect(() => {
    fetchLikedTracks()
    fetchPlaylists()
  }, [])

  const autoPlaylists = playlists.filter(p => p.type === 'AUTO_GENRE')
  const manualPlaylists = playlists.filter(p => p.type === 'MANUAL')

  return (
    <div style={{ color: '#fff', padding: '24px' }}>
      <div style={{ fontSize: '11px', color: '#1DB954', letterSpacing: '1px', marginBottom: '6px' }}>MY PAGE</div>
      <div style={{ fontSize: '22px', fontWeight: '500', marginBottom: '24px' }}>마이페이지</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%', background: '#1DB954',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', fontWeight: '500', color: '#000'
        }}>WC</div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: '500' }}>권원철</div>
          <div style={{ fontSize: '13px', color: '#aaa', marginTop: '4px' }}>wonchul@gmail.com</div>
        </div>
      </div>

      <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>통계</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '28px' }}>
        {[
          { label: '좋아요한 곡', value: likedSongs.length },
          { label: '자동 플레이리스트', value: autoPlaylists.length },
          { label: '수동 플레이리스트', value: manualPlaylists.length },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#1a1a1a', borderRadius: '8px', padding: '14px'
          }}>
            <div style={{ fontSize: '22px', fontWeight: '500', color: '#1DB954' }}>{stat.value}</div>
            <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>내 플레이리스트</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
        {autoPlaylists.length === 0 && manualPlaylists.length === 0 ? (
          <div style={{ color: '#aaa', fontSize: '13px' }}>플레이리스트가 없어요</div>
        ) : (
          [...autoPlaylists, ...manualPlaylists].map(playlist => (
            <div key={playlist.id} style={{
              background: '#1a1a1a', borderRadius: '8px', padding: '12px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '13px', color: '#fff' }}>{playlist.name}</div>
                <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>
                  {playlist.type === 'AUTO_GENRE' ? '자동' : '수동'} • {playlist.tracks?.length || 0}곡
                </div>
              </div>
              <div style={{
                fontSize: '10px', color: playlist.type === 'AUTO_GENRE' ? '#1DB954' : '#aaa',
                background: playlist.type === 'AUTO_GENRE' ? '#0f3d20' : '#333',
                padding: '3px 8px', borderRadius: '20px'
              }}>
                {playlist.type === 'AUTO_GENRE' ? '자동' : '수동'}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>연동 상태</div>
      <div style={{
        background: '#1a1a1a', borderRadius: '10px',
        border: '0.5px solid #333', overflow: 'hidden', marginBottom: '28px'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', borderBottom: '0.5px solid #333'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', background: '#1DB954',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px'
            }}>♪</div>
            <div>
              <div style={{ fontSize: '13px' }}>Spotify</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>음악 데이터 연동</div>
            </div>
          </div>
          <div style={{
            fontSize: '11px', background: '#0f3d20', color: '#1DB954',
            padding: '4px 10px', borderRadius: '20px'
          }}>연동됨</div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', background: '#4285F4',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', color: '#fff'
            }}>G</div>
            <div>
              <div style={{ fontSize: '13px' }}>Google</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>로그인 연동</div>
            </div>
          </div>
          <div style={{
            fontSize: '11px', background: '#0f3d20', color: '#1DB954',
            padding: '4px 10px', borderRadius: '20px'
          }}>연동됨</div>
        </div>
      </div>

      <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>선호 장르</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {autoPlaylists.length > 0 ? (
          autoPlaylists.map(p => (
            <div key={p.id} style={{
              background: '#1a1a1a', border: '0.5px solid #333',
              borderRadius: '20px', padding: '6px 14px', fontSize: '12px', color: '#fff'
            }}>{p.name}</div>
          ))
        ) : (
          ['K-Pop', 'Pop', 'R&B', 'Indie', 'Jazz'].map(genre => (
            <div key={genre} style={{
              background: '#1a1a1a', border: '0.5px solid #333',
              borderRadius: '20px', padding: '6px 14px', fontSize: '12px', color: '#fff'
            }}>{genre}</div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyPage