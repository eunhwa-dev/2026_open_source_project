function LikedSongs() {
  const songs = [
    { id: 1, title: "Show Me Love", artist: "WizTheMc, bees & honey", album: "Show Me Love", date: "1주 전", duration: "2:57" },
    { id: 2, title: "Dynamite", artist: "BTS", album: "Dynamite", date: "1주 전", duration: "3:19" },
    { id: 3, title: "Hold On", artist: "Justin Bieber", album: "Justice", date: "1주 전", duration: "2:51" },
    { id: 4, title: "a bird's last look", artist: "skywave", album: "a bird's last look", date: "2주 전", duration: "1:25" },
    { id: 5, title: "Shape of You", artist: "Ed Sheeran", album: "÷", date: "3주 전", duration: "3:53" },
  ]

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
          <div style={{ fontSize: '13px', color: '#aaa' }}>나 • {songs.length}곡</div>
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
          display: 'grid', gridTemplateColumns: '32px 1fr 1fr 100px 50px',
          gap: '8px', padding: '8px 12px', borderBottom: '0.5px solid #333',
          fontSize: '11px', color: '#aaa', marginBottom: '4px'
        }}>
          <span>#</span><span>제목</span><span>앨범</span><span>추가한 날짜</span><span>⏱</span>
        </div>

        {songs.map((song, i) => (
          <div key={song.id} style={{
            display: 'grid', gridTemplateColumns: '32px 1fr 1fr 100px 50px',
            gap: '8px', padding: '10px 12px', borderRadius: '6px', alignItems: 'center', cursor: 'pointer'
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a1035'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <span style={{ fontSize: '13px', color: '#aaa' }}>{i + 1}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', background: '#2d1f6e',
                borderRadius: '4px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', color: '#a78bfa'
              }}>♪</div>
              <div>
                <div style={{ fontSize: '13px', color: '#fff' }}>{song.title}</div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>{song.artist}</div>
              </div>
            </div>
            <span style={{ fontSize: '12px', color: '#aaa' }}>{song.album}</span>
            <span style={{ fontSize: '12px', color: '#aaa' }}>{song.date}</span>
            <span style={{ fontSize: '12px', color: '#aaa' }}>{song.duration}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LikedSongs