import { Routes, Route } from 'react-router-dom'
import Auth from './pages/auth/Auth'
import Profile from './pages/app/Profile'
import MarketPlace from './pages/app/Marketplace'
import Reviews from './pages/app/Reviews'
import Home from './pages/app/Home'



function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/home" element={<Home />} />
      <Route path="/marketplace" element={<MarketPlace />} />
      <Route path="/reviews" element={<Reviews />} />
    </Routes>
  )
}

export default App