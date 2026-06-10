import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const user = JSON.parse(localStorage.getItem('listoraUser') || 'null')
  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'WC'

  const handleSearch = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 16px', background: '#000',
      borderBottom: '0.5px solid #333'
    }}>
      <div style={{ fontSize: '15px', fontWeight: '500', color: '#1DB954', minWidth: '80px' }}>
        LISTORA
      </div>
      <input
        placeholder="곡, 아티스트, 플레이리스트 검색"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleSearch}
        style={{
          flex: 1, background: '#222', border: '0.5px solid #444',
          borderRadius: '20px', padding: '6px 14px', color: '#fff',
          fontSize: '13px', outline: 'none'
        }}
      />
      <div style={{ display: 'flex', gap: '4px' }}>
        <Link to="/" style={{
          background: location.pathname === '/' ? '#222' : 'none',
          border: 'none', color: location.pathname === '/' ? '#fff' : '#aaa',
          fontSize: '12px', cursor: 'pointer', padding: '6px 10px',
          borderRadius: '6px', textDecoration: 'none'
        }}>홈</Link>
        {user && (
          <Link to="/mypage" style={{
            background: location.pathname === '/mypage' ? '#222' : 'none',
            border: 'none', color: location.pathname === '/mypage' ? '#fff' : '#aaa',
            fontSize: '12px', cursor: 'pointer', padding: '6px 10px',
            borderRadius: '6px', textDecoration: 'none'
          }}>마이페이지</Link>
        )}
      </div>
      {user && (
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%', background: '#1DB954',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', fontWeight: '500', color: '#000', marginLeft: 'auto',
          cursor: 'pointer'
        }}>{initials}</div>
      )}
    </div>
  )
}

export default Navbar