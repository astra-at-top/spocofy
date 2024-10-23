import { Routes , Route } from 'react-router-dom'
import AuthPage from './Pages/Authpage'
function App() {


  return (
    <>
      <Routes>
        <Route path='/login' element={<AuthPage/>}></Route>
        <Route path='/signup' element={<AuthPage/>}></Route>
      </Routes>
    </>
  )
}

export default App
