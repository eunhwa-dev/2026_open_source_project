import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const navItems = [
    { path: '/', label: '홈' },
    { path: '/mypage', label: '마이페이지' },
  ]

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
        {navItems.map(item => (
          <Link key={item.path} to={item.path} style={{
            background: location.pathname === item.path ? '#222' : 'none',
            border: 'none', color: location.pathname === item.path ? '#fff' : '#aaa',
            fontSize: '12px', cursor: 'pointer', padding: '6px 10px',
            borderRadius: '6px', textDecoration: 'none'
          }}>
            {item.label}
          </Link>
        ))}
      </div>
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%', background: '#1DB954',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontWeight: '500', color: '#000', marginLeft: 'auto'
      }}>WC</div>
    </div>
  )
}

export default Navbar