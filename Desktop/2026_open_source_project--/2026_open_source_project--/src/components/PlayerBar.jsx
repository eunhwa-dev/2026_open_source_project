import { useEffect, useRef } from 'react'
import useMusicStore from '../store/musicStore'

function PlayerBar() {
  const { player, fetchPlayer, playTrack, pauseTrack, setVolume } = useMusicStore()
  const { currentTrack, isPlaying, volumePercent } = player

  useEffect(() => {
    fetchPlayer()
  }, [])

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack()
    } else if (currentTrack) {
      playTrack(currentTrack)
    }
  }

  const handleVolume = (e) => {
    setVolume(Number(e.target.value))
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '10px 16px', background: '#000',
      borderTop: '0.5px solid #333'
    }}>
      {/* 앨범 커버 + 곡 정보 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '180px' }}>
        {currentTrack?.albumImageUrl ? (
          <img src={currentTrack.albumImageUrl} alt="앨범"
            style={{ width: '36px', height: '36px', borderRadius: '4px', flexShrink: 0 }} />
        ) : (
          <div style={{ width: '36px', height: '36px', background: '#333', borderRadius: '4px', flexShrink: 0 }} />
        )}
        <div>
          <div style={{ fontSize: '12px', fontWeight: '500', color: '#fff' }}>
            {currentTrack?.title || '-'}
          </div>
          <div style={{ fontSize: '10px', color: '#aaa' }}>
            {currentTrack?.artistName || '-'}
          </div>
        </div>
      </div>

      {/* 재생 컨트롤 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'center' }}>
        <button style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '14px', cursor: 'pointer' }}>⏮</button>
        <button
          onClick={handlePlayPause}
          style={{
            width: '28px', height: '28px', borderRadius: '50%', background: '#fff',
            border: 'none', color: '#000', fontSize: '12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '14px', cursor: 'pointer' }}>⏭</button>
      </div>

      {/* 진행바 */}
      <div style={{ flex: 2, height: '3px', background: '#333', borderRadius: '2px' }}>
        <div style={{ width: '0%', height: '100%', background: '#1DB954', borderRadius: '2px' }} />
      </div>

      {/* 볼륨 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '12px', color: '#aaa' }}>🔊</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volumePercent}
          onChange={handleVolume}
          style={{ width: '60px', accentColor: '#1DB954', cursor: 'pointer' }}
        />
      </div>
    </div>
  )
}

export default PlayerBar