import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/Home.jsx'
import Navbar from './components/Navbar.jsx'
import Profile from './pages/Profile.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Admin from './pages/Admin.jsx'
import SearchResults from './pages/SearchResults.jsx'
createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search-results" element={<SearchResults />} />
      </Routes>
    </BrowserRouter>
  </>,
)
