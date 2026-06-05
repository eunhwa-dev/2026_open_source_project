import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import PlayerBar from './components/PlayerBar'
import LikedSongs from './pages/LikedSongs'
import GenrePlaylists from './pages/GenrePlaylists'
import PlaylistDetail from './pages/PlaylistDetail'
import MyPage from './pages/MyPage'
import Login from './pages/Login'
import Playlist from './pages/Playlist'
import Search from './pages/Search'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#111', color: '#fff' }}>
        <Navbar />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar />
          <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/liked" element={<LikedSongs />} />
              <Route path="/playlist" element={<Playlist />} />
              <Route path="/playlist/:id" element={<PlaylistDetail />} />
              <Route path="/playlist/auto/:name" element={<PlaylistDetail />} />
              <Route path="/playlist/manual/:name" element={<PlaylistDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </div>
        <PlayerBar />
      </div>
    </BrowserRouter>
  )
}

export default App