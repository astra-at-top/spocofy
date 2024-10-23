import { Routes, Route } from 'react-router-dom'
import AuthPage from './Pages/Authpage'
import PageNotFound from './Pages/Pagenotfound'
import Dashboard from './Pages/Dashboard'
import { useAuth } from './Customhooks/useAuth'
import Loading from './Pages/Loading'
import ProtectedRoute from './Utils/ProtectedRoute'

function App() {
  const { isLoading } = useAuth()
  console.log(isLoading,"isLoadingisLoadingisLoading")
  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <Routes>
        <Route path='/login' element={<AuthPage />} />
        <Route path='/signup' element={<AuthPage />} />
        <Route path='dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App
