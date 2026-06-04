import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [erreur, setErreur] = useState(null)
  const [loading, setLoading] = useState(false)

  // Si déjà connecté → aller direct au tableau de bord
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/admin/commandes', { replace: true })
    })
  }, [navigate])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErreur(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setErreur('Veuillez remplir tous les champs.')
      return
    }

    setLoading(true)
    setErreur(null)

    const { error } = await supabase.auth.signInWithPassword({
      email:    form.email,
      password: form.password,
    })

    if (error) {
      setErreur('Email ou mot de passe incorrect.')
      setLoading(false)
    } else {
      navigate('/admin/commandes', { replace: true })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#fdfaf6' }}>
      <div className="w-full max-w-sm">

        {/* En-tête */}
        <div className="text-center mb-8">
          <p className="font-ui uppercase tracking-widest text-or-accent text-xs mb-3"
             style={{ letterSpacing: '0.3em' }}>
            ✦ Espace Admin ✦
          </p>
          <h1 className="font-display font-bold text-brun-fonce text-3xl mb-3">Women Hood</h1>
          <div className="flex items-center justify-center gap-4">
            <div className="gold-divider w-12" />
            <span className="text-or-accent text-xs">◆</span>
            <div className="gold-divider w-12" />
          </div>
        </div>

        {/* Carte formulaire */}
        <div className="bg-white border border-beige-200 shadow-sm px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            <div>
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@womenhood.dz"
                className="form-input"
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="password">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            {erreur && (
              <p className="font-ui text-red-500 text-xs bg-red-50 border border-red-200 px-4 py-3">
                {erreur}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connexion…
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </div>

        <p className="text-center font-ui text-brun-clair text-xs mt-6">
          Accès réservé au personnel autorisé
        </p>
      </div>
    </div>
  )
}
