import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import SearchResults from './pages/SearchResults'
import PropertyDetails from './pages/PropertyDetails'
import Profile from './pages/Profile'
import ListProperty from './pages/ListProperty'
import { useAuthStore } from './store/authStore'

export default function App() {
  const [isDark, setIsDark] = useState(false)
  const { initializeAuth } = useAuthStore()

  useEffect(() => {
    initializeAuth()
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true)
    }
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <Router>
      <div className={isDark ? 'dark' : ''}>
        <Navbar isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />
        <main className="min-h-screen bg-white dark:bg-gray-950">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/list-property" element={<ListProperty />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster position="top-right" />
    </Router>
  )
}
