function PlayerBar() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '10px 16px', background: '#000',
      borderTop: '0.5px solid #333'
    }}>
      <div style={{ width: '36px', height: '36px', background: '#333', borderRadius: '4px', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', fontWeight: '500', color: '#fff' }}>Blinding Lights</div>
        <div style={{ fontSize: '10px', color: '#aaa' }}>The Weeknd</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '14px', cursor: 'pointer' }}>⏮</button>
        <button style={{
          width: '28px', height: '28px', borderRadius: '50%', background: '#fff',
          border: 'none', color: '#000', fontSize: '12px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>▶</button>
        <button style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '14px', cursor: 'pointer' }}>⏭</button>
      </div>
      <div style={{ flex: 1, height: '3px', background: '#333', borderRadius: '2px' }}>
        <div style={{ width: '35%', height: '100%', background: '#1DB954', borderRadius: '2px' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '12px', color: '#aaa' }}>🔊</span>
        <div style={{ width: '50px', height: '3px', background: '#333', borderRadius: '2px' }}>
          <div style={{ width: '70%', height: '100%', background: '#aaa', borderRadius: '2px' }} />
        </div>
      </div>
    </div>
  )
}

export default PlayerBar