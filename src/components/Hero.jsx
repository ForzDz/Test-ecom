// =====================================================
// HERO – Bannière principale avec slogan et image produit
// =====================================================

export default function Hero({ onDecouvrir }) {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #fdfaf6 0%, #f9f2e8 40%, #f0d6d6 100%)',
      }}
    >
      {/* Cercle décoratif de fond (grand) */}
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 rounded-full pointer-events-none"
        style={{
          width: 'clamp(300px, 60vw, 700px)',
          height: 'clamp(300px, 60vw, 700px)',
          background: 'radial-gradient(circle, rgba(240,214,214,0.5) 0%, rgba(249,242,232,0) 70%)',
        }}
      />

      {/* Motif de points dorés */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #d4a843 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* ---- Texte gauche ---- */}
          <div className="text-center md:text-left">

            {/* Sous-titre en or */}
            <p
              className="font-ui uppercase tracking-widest text-or-accent text-xs mb-4 opacity-anim animate-fade-up"
              style={{ letterSpacing: '0.3em' }}
            >
              ✦ Nouvelle Collection 2026 ✦
            </p>

            {/* Titre principal */}
            <h1
              className="font-display font-bold text-brun-fonce mb-4 opacity-anim animate-fade-up animate-delay-100"
              style={{ fontSize: 'clamp(2.2rem, 7vw, 4.5rem)', lineHeight: '1.1' }}
            >
              L'Art du
              <br />
              <span className="font-display italic text-gold-gradient">Sac à Main</span>
            </h1>

            {/* Description */}
            <p
              className="font-body text-brun-clair leading-relaxed mb-8 max-w-md mx-auto md:mx-0 opacity-anim animate-fade-up animate-delay-200"
              style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)' }}
            >
              Chaque sac Women Hood est pensé pour la femme algérienne moderne —
              alliant élégance raffinée, matières nobles et style intemporel.
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start opacity-anim animate-fade-up animate-delay-300">
              <button
                onClick={onDecouvrir}
                className="btn-primary"
              >
                Découvrir la collection
              </button>
              <div className="flex items-center justify-center gap-2 text-brun-clair font-ui text-xs uppercase tracking-widest">
                <svg className="w-4 h-4 text-or-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
                Livraison partout en Algérie
              </div>
            </div>

            {/* Badges de confiance */}
            <div className="flex items-center gap-6 mt-10 justify-center md:justify-start opacity-anim animate-fade-up animate-delay-400">
              {[
                { icon: '🚚', label: 'Livraison rapide' },
                { icon: '💳', label: 'Paiement à la livraison' },
                { icon: '✨', label: 'Qualité premium' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <span className="text-xl">{icon}</span>
                  <span className="font-ui text-brun-clair text-xs text-center leading-tight" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ---- Image droite ---- */}
          <div className="relative flex justify-center opacity-anim animate-fade-up animate-delay-200">
            {/* Fond circulaire rosé */}
            <div
              className="absolute inset-0 rounded-full mx-auto my-auto"
              style={{
                width: '85%',
                height: '85%',
                top: '7.5%',
                left: '7.5%',
                background: 'radial-gradient(circle, #f0d6d6 0%, #f9f2e8 70%)',
              }}
            />

            {/* Ornement doré autour de l'image */}
            <div
              className="absolute rounded-full border-2 border-or-clair opacity-60"
              style={{
                width: '90%',
                height: '90%',
                top: '5%',
                left: '5%',
              }}
            />

            {/* Image produit mise en avant */}
            <img
              src="/src/images/sac3.png"
              alt="Sac Women Hood – vedette de la collection"
              className="relative z-10 object-contain drop-shadow-2xl"
              style={{
                maxHeight: 'clamp(260px, 50vw, 480px)',
                filter: 'drop-shadow(0 20px 40px rgba(74,50,40,0.2))',
              }}
            />

            {/* Étiquette prix flottante */}
            <div
              className="absolute bottom-8 right-4 md:right-0 bg-white/90 backdrop-blur-sm border border-beige-200 px-4 py-2 shadow-lg z-20 animate-fade-in animate-delay-500"
            >
              <p className="font-ui text-brun-clair uppercase tracking-widest" style={{ fontSize: '0.6rem' }}>À partir de</p>
              <p className="font-display font-bold text-brun-fonce text-lg">2 900 DA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flèche de scroll vers le bas */}
      <button
        onClick={onDecouvrir}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-brun-clair/60 hover:text-or-accent transition-colors duration-300 animate-bounce"
        aria-label="Voir les produits"
      >
        <span className="font-ui text-xs uppercase tracking-widest" style={{ letterSpacing: '0.2em' }}>Voir</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </section>
  )
}
