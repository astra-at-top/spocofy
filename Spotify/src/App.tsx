import { Routes , Route } from 'react-router-dom'
import AuthPage from './Pages/Authpage'
import PageNotFound from './Pages/Pagenotfound'
function App() {


  return (
    <>
      <Routes>
        <Route path='/login' element={<AuthPage/>}></Route>
        <Route path='/signup' element={<AuthPage/>}></Route>
        <Route path='*' element={<PageNotFound/>}></Route>
      </Routes>
    </>
  )
}

export default App
