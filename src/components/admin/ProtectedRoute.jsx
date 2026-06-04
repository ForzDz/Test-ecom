import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

// Garde de route : vérifie la session Supabase.
// session === undefined → chargement en cours
// session === null      → non connecté → redirige vers /admin/login
// session === object    → connecté → affiche children
export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    // Lecture initiale de la session depuis le storage local
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Écoute les changements d'état (login / logout / expiration token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )

    return () => subscription.unsubscribe()
  }, [])

  // Pendant la vérification : spinner centré
  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fdfaf6' }}>
        <div className="w-8 h-8 border-2 border-or-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return <Navigate to="/admin/login" replace />

  return children
}
