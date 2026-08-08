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
import AdminLogin from './pages/AdminLogin.jsx'
import NotFound from './pages/NotFound.jsx'
import Msg from './pages/Msg.jsx'
import SearchResults from './pages/SearchResults.jsx'
import Chat from './pages/Chat.jsx'
import UserProfile from './pages/UserProfile.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/user/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/msg" element={<ProtectedRoute><Msg /></ProtectedRoute>} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </>,
)
