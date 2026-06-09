import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import PlayerBar from './components/PlayerBar'
import LikedSongs from './pages/LikedSongs'
import PlaylistDetail from './pages/PlaylistDetail'
import MyPage from './pages/MyPage'
import Login from './pages/Login'
import Playlist from './pages/Playlist'
import Search from './pages/Search'
import Home from './pages/Home'

function RequireAuth({ children }) {
  const user = localStorage.getItem('listoraUser')
  if (!user) return <Navigate to="/login" replace />
  return children
}

function Layout({ children }) {
  const user = localStorage.getItem('listoraUser')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#111', color: '#fff' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {user && <Sidebar />}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
          {children}
        </div>
      </div>
      {user && <PlayerBar />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <Layout><Home /></Layout>
        } />
        <Route path="/search" element={
          <Layout><Search /></Layout>
        } />
        <Route path="/liked" element={
          <RequireAuth>
            <Layout><LikedSongs /></Layout>
          </RequireAuth>
        } />
        <Route path="/playlist" element={
          <RequireAuth>
            <Layout><Playlist /></Layout>
          </RequireAuth>
        } />
        <Route path="/playlist/:id" element={
          <RequireAuth>
            <Layout><PlaylistDetail /></Layout>
          </RequireAuth>
        } />
        <Route path="/playlist/auto/:name" element={
          <RequireAuth>
            <Layout><PlaylistDetail /></Layout>
          </RequireAuth>
        } />
        <Route path="/playlist/manual/:name" element={
          <RequireAuth>
            <Layout><PlaylistDetail /></Layout>
          </RequireAuth>
        } />
        <Route path="/mypage" element={
          <RequireAuth>
            <Layout><MyPage /></Layout>
          </RequireAuth>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App