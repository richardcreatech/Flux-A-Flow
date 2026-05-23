import { Routes, Route } from 'react-router-dom'
import Auth from './pages/auth/Auth'
import Dashboard from './pages/app/Dashboard'



function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/main" element={<Dashboard />} />
   
    </Routes>
  )
}

export default App