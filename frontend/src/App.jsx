import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/app/main/Dashboard'
import Auth from './pages/auth/Auth'
import Startup from './pages/app/main/Startup'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/main" element={<Dashboard />} />
      <Route path="/my_startup" element={<Startup />} />
    </Routes>
  )
}

export default App