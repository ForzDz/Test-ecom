import { Routes, Route } from 'react-router-dom'
import App from './App'
import Login from './pages/admin/Login'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'

export default function AppRouter() {
  return (
    <Routes>
      {/* Boutique publique */}
      <Route path="/" element={<App />} />

      {/* Login admin — accessible sans session */}
      <Route path="/admin/login" element={<Login />} />

      {/* Toutes les pages /admin/* — protégées par ProtectedRoute */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
