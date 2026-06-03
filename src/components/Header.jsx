// =====================================================
// HEADER – Logo + navigation + icône panier
// =====================================================
import { useState, useEffect } from 'react'

export default function Header({ nbArticles, onOuvrirPanier }) {
  // Détection du scroll pour changer le style du header
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-beige-50/95 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">

        {/* Logo textuel élégant */}
        <div className="flex flex-col leading-none">
          <span
            className="font-display font-bold tracking-widest uppercase text-brun-fonce"
            style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', letterSpacing: '0.25em' }}
          >
            Women
          </span>
          <span
            className="font-display italic text-or-accent"
            style={{ fontSize: 'clamp(0.75rem, 2.5vw, 1rem)', letterSpacing: '0.4em', marginTop: '-2px' }}
          >
            Hood
          </span>
        </div>

        {/* Slogan central (masqué sur mobile) */}
        <p className="hidden md:block font-body italic text-brun-clair text-sm tracking-wide">
          L'élégance à votre portée
        </p>

        {/* Bouton panier */}
        <button
          onClick={onOuvrirPanier}
          className="relative flex items-center gap-2 btn-outline group"
          aria-label={`Ouvrir le panier – ${nbArticles} article(s)`}
        >
          {/* Icône sac */}
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>

          <span className="font-ui text-xs tracking-widest uppercase hidden sm:inline">
            Panier
          </span>

          {/* Badge nombre d'articles */}
          {nbArticles > 0 && (
            <span className="absolute -top-2 -right-2 bg-or-moyen text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-ui font-medium animate-fade-in">
              {nbArticles}
            </span>
          )}
        </button>

      </div>

      {/* Ligne dorée sous le header */}
      <div className="gold-divider mt-3 opacity-40" />
    </header>
  )
}
