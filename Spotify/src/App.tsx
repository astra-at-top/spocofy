import { Routes, Route } from 'react-router-dom'
import AuthPage from './Pages/Authpage'
import PageNotFound from './Pages/Pagenotfound'
import Dashboard from './Pages/Dashboard'
import { useAuth } from './Customhooks/useAuth'
import Loading from './Pages/Loading'
import ProtectedRoute from './Utils/ProtectedRoute'
import SearchSong from './Pages/Searchsong'
import Playlist from "./Pages/Playlist" 
// import PlaylistCreate from './Pages/Playlistcreate'
import Dashboardhome from './Pages/Dashboardhome'
import PlaylistDetail from "./Pages/Playlistdetail"

function App() {
  const { isLoading } = useAuth()
  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <Routes>
        <Route path='/login' element={<AuthPage />} />
        <Route path='/signup' element={<AuthPage />} />
        <Route path='/' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboardhome/>} />
          <Route path='search' element={<SearchSong />} />
          <Route path='playlist' element={<Playlist/>} />
          <Route path='playlist/:id' element={<PlaylistDetail/>} />
        </Route>
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App
