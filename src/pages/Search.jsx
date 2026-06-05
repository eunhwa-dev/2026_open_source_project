import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

function Search() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('전체')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [searchParams] = useSearchParams()

  const filters = ['전체', '곡', '아티스트', '앨범']

  const mockData = [
    { id: 1, title: "Dynamite", artist: "BTS", album: "Dynamite", duration: "3:19", type: '곡' },
    { id: 2, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:20", type: '곡' },
    { id: 3, title: "Shape of You", artist: "Ed Sheeran", album: "÷", duration: "3:53", type: '곡' },
    { id: 4, title: "Ditto", artist: "NewJeans", album: "OMG", duration: "3:05", type: '곡' },
    { id: 5, title: "Love Story", artist: "Taylor Swift", album: "Fearless", duration: "3:55", type: '곡' },
  ]

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      const filtered = mockData.filter(s =>
        s.title.toLowerCase().includes(q.toLowerCase()) ||
        s.artist.toLowerCase().includes(q.toLowerCase())
      )
      setResults(filtered)
      setSearched(true)
    }
  }, [searchParams])

  const handleSearch = () => {
    if (!query.trim()) return
    const filtered = mockData.filter(s =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.artist.toLowerCase().includes(query.toLowerCase())
    )
    setResults(filtered)
    setSearched(true)
  }

  const filtered = filter === '전체' ? results : results.filter(r => r.type === filter)

  return (
    <div style={{ color: '#fff', padding: '24px' }}>
      <div style={{ fontSize: '11px', color: '#1DB954', letterSpacing: '1px', marginBottom: '6px' }}>
        SEARCH
      </div>
      <div style={{ fontSize: '22px', fontWeight: '500', marginBottom: '20px' }}>음악 검색</div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="곡, 아티스트, 앨범 검색..."
          style={{
            flex: 1, background: '#1a1a1a', border: '0.5px solid #444',
            borderRadius: '8px', padding: '10px 16px', color: '#fff',
            fontSize: '14px', outline: 'none'
          }}
        />
        <button onClick={handleSearch} style={{
          background: '#1DB954', border: 'none', borderRadius: '8px',
          color: '#000', fontSize: '13px', fontWeight: '500',
          padding: '10px 20px', cursor: 'pointer'
        }}>검색</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
            background: filter === f ? '#1DB954' : '#222',
            color: filter === f ? '#000' : '#aaa',
            fontSize: '12px', fontWeight: filter === f ? '500' : '400'
          }}>{f}</button>
        ))}
      </div>

      {searched && filtered.length === 0 && (
        <div style={{ color: '#aaa', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>
          검색 결과가 없어요 😢
        </div>
      )}

      {filtered.map((song, i) => (
        <div key={song.id} style={{
          display: 'grid', gridTemplateColumns: '32px 1fr 200px 80px 80px',
          gap: '8px', padding: '10px 12px', borderRadius: '8px',
          alignItems: 'center', cursor: 'pointer', marginBottom: '4px'
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <span style={{ fontSize: '13px', color: '#aaa' }}>{i + 1}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px', height: '40px', background: '#222', borderRadius: '4px',
              flexShrink: 0, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '16px', color: '#1DB954'
            }}>♪</div>
            <div>
              <div style={{ fontSize: '13px', color: '#fff' }}>{song.title}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>{song.artist}</div>
            </div>
          </div>
          <span style={{ fontSize: '12px', color: '#aaa' }}>{song.album}</span>
          <span style={{ fontSize: '12px', color: '#aaa' }}>{song.duration}</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button style={{
              background: 'none', border: '0.5px solid #555', borderRadius: '20px',
              color: '#aaa', fontSize: '11px', padding: '4px 10px', cursor: 'pointer'
            }}>♥ 좋아요</button>
            <button style={{
              background: 'none', border: '0.5px solid #555', borderRadius: '20px',
              color: '#aaa', fontSize: '11px', padding: '4px 10px', cursor: 'pointer'
            }}>🔗</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Search