import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Commandes from '../../pages/admin/Commandes'
import Produits from '../../pages/admin/Produits'

export default function AdminLayout() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 font-ui text-sm uppercase tracking-wider transition-colors duration-200 ${
      isActive
        ? 'bg-or-accent/20 text-or-accent'
        : 'text-beige-300 hover:text-beige-50 hover:bg-white/5'
    }`

  return (
    <div className="min-h-screen flex" style={{ background: '#fdfaf6' }}>

      {/* ── Sidebar fixe ── */}
      <aside className="w-56 bg-brun-fonce text-beige-50 flex flex-col fixed top-0 bottom-0 left-0 z-40">

        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <p className="font-ui text-or-accent uppercase tracking-widest text-xs mb-1"
             style={{ letterSpacing: '0.3em' }}>
            ✦ Admin ✦
          </p>
          <h1 className="font-display font-bold text-xl text-beige-50">Women Hood</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink to="/admin/commandes" className={navClass}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Commandes
          </NavLink>

          <NavLink to="/admin/produits" className={navClass}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Produits
          </NavLink>
        </nav>

        {/* Déconnexion */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 font-ui text-sm uppercase tracking-wider text-beige-300 hover:text-beige-50 hover:bg-white/5 transition-colors duration-200"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Contenu principal (décalé de la largeur sidebar) ── */}
      <main className="flex-1 ml-56 min-h-screen">
        <Routes>
          <Route index element={<Navigate to="commandes" replace />} />
          <Route path="commandes" element={<Commandes />} />
          <Route path="produits"  element={<Produits />} />
        </Routes>
      </main>

    </div>
  )
}
