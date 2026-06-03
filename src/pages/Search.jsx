import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const API_BASE_URL = 'http://localhost:4000'
const TEST_USER_ID = 'test-user'

function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      searchTracks(q)
    }
  }, [searchParams])

  const searchTracks = async (keyword = query) => {
    if (!keyword.trim()) return

    setLoading(true)
    setStatus('Searching Spotify through backend...')

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/spotify/search?q=${encodeURIComponent(keyword)}&type=track&limit=10`
      )

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const data = await response.json()
      setResults(data.tracks || [])
      setStatus(`Found ${(data.tracks || []).length} tracks from backend.`)
    } catch (error) {
      setStatus(error.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const likeTrack = async (track) => {
    setStatus(`Saving "${track.title}" and syncing genre playlists...`)

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${TEST_USER_ID}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(track)
      })

      if (!response.ok) {
        throw new Error(`Like failed: ${response.status}`)
      }

      const data = await response.json()
      setPlaylists(data.syncedPlaylists || [])
      setStatus(`Saved. Synced ${(data.syncedPlaylists || []).length} genre playlists.`)
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <div style={{ color: '#fff', padding: '24px' }}>
      <div style={{ fontSize: '11px', color: '#1DB954', letterSpacing: '1px', marginBottom: '6px' }}>
        BACKEND INTEGRATION CHECK
      </div>
      <div style={{ fontSize: '22px', fontWeight: '500', marginBottom: '20px' }}>
        Spotify Search
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && searchTracks()}
          placeholder="Search tracks..."
          style={{
            flex: 1,
            background: '#1a1a1a',
            border: '0.5px solid #444',
            borderRadius: '8px',
            padding: '10px 16px',
            color: '#fff',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <button
          onClick={() => searchTracks()}
          disabled={loading}
          style={{
            background: '#1DB954',
            border: 'none',
            borderRadius: '8px',
            color: '#000',
            fontSize: '13px',
            fontWeight: '500',
            padding: '10px 20px',
            cursor: 'pointer'
          }}
        >
          Search
        </button>
      </div>

      <div style={{ minHeight: '24px', color: '#aaa', fontSize: '13px', marginBottom: '16px' }}>
        {status}
      </div>

      {results.map((song, index) => (
        <div
          key={song.spotifyTrackId}
          style={{
            display: 'grid',
            gridTemplateColumns: '32px 48px 1fr 120px',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: '8px',
            alignItems: 'center',
            marginBottom: '4px',
            background: '#111'
          }}
        >
          <span style={{ fontSize: '13px', color: '#aaa' }}>{index + 1}</span>
          <img
            src={song.albumImageUrl || '/favicon.svg'}
            alt=""
            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
          />
          <div>
            <div style={{ fontSize: '13px', color: '#fff' }}>{song.title}</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>{song.artistName}</div>
          </div>
          <button
            onClick={() => likeTrack(song)}
            style={{
              background: 'none',
              border: '0.5px solid #555',
              borderRadius: '20px',
              color: '#ddd',
              fontSize: '12px',
              padding: '6px 12px',
              cursor: 'pointer'
            }}
          >
            Like
          </button>
        </div>
      ))}

      {playlists.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <div style={{ fontSize: '16px', marginBottom: '10px' }}>Synced Genre Playlists</div>
          {playlists.map((playlist) => (
            <div key={playlist.id} style={{ color: '#aaa', fontSize: '13px', marginBottom: '6px' }}>
              {playlist.name}: {playlist.tracks.length} track(s)
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Search
