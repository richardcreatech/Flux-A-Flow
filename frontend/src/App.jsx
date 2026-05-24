import { Routes, Route } from 'react-router-dom'
import Auth from './pages/auth/Auth'
import Profile from './pages/app/Profile'
import MarketPlace from './pages/app/Marketplace'



function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/marketplace" element={<MarketPlace />} />
    </Routes>
  )
}

export default App