import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const previews = [
    { name: 'K-Pop 베스트', count: 32, color: '#1DB954' },
    { name: 'Chill Vibes', count: 18, color: '#a78bfa' },
    { name: '운동할 때', count: 24, color: '#f59e0b' },
    { name: '드라이브', count: 15, color: '#ef4444' },
  ]

  return (
    <div style={{ color: '#fff', padding: '24px' }}>

      <div style={{
        background: 'linear-gradient(135deg, #0f2d1f, #1a1035)',
        borderRadius: '16px', padding: '40px', marginBottom: '32px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
      }}>
        <div style={{ fontSize: '13px', color: '#1DB954', letterSpacing: '2px', marginBottom: '12px' }}>
          LISTORA
        </div>
        <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px', lineHeight: 1.3 }}>
          당신의 음악을<br />자동으로 정리해드려요
        </div>
        <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '24px', lineHeight: 1.7 }}>
          Spotify 좋아요 곡을 장르별로 자동 분류하고<br />
          나만의 플레이리스트를 만들어보세요
        </div>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: '#1DB954', border: 'none', borderRadius: '30px',
            color: '#000', fontSize: '14px', fontWeight: '500',
            padding: '12px 28px', cursor: 'pointer'
          }}>
          Google로 시작하기
        </button>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '11px', color: '#1DB954', letterSpacing: '1px', marginBottom: '8px' }}>CORE VALUES</div>
        <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '16px' }}>핵심 가치</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { icon: '🎵', title: '자동 분류', desc: '좋아요한 곡을 장르별로 자동으로 분류해드려요' },
            { icon: '📋', title: '스마트 플레이리스트', desc: '취향에 맞는 플레이리스트를 자동으로 생성해요' },
            { icon: '🔗', title: 'Spotify 연동', desc: 'Spotify 계정과 연동해서 음악을 불러와요' },
          ].map(item => (
            <div key={item.title} style={{
              background: '#1a1a1a', border: '0.5px solid #333',
              borderRadius: '12px', padding: '20px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>{item.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>{item.title}</div>
              <div style={{ fontSize: '12px', color: '#aaa', lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: '11px', color: '#1DB954', letterSpacing: '1px', marginBottom: '8px' }}>PREVIEW</div>
        <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '16px' }}>플레이리스트 미리보기</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {previews.map(p => (
            <div key={p.name}
              onClick={() => navigate('/playlist')}
              style={{
                background: '#1a1a1a', border: '0.5px solid #333',
                borderRadius: '10px', overflow: 'hidden', cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#222'}
              onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}
            >
              <div style={{
                height: '80px', background: p.color, opacity: 0.3,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px'
              }}>♪</div>
              <div style={{ padding: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>{p.name}</div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>{p.count}곡</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Home