// =====================================================
// PRODUCT CARD – Carte individuelle d'un produit
// =====================================================

export default function ProductCard({ produit, onAjouterAuPanier }) {
  return (
    <article className="product-card group flex flex-col">

      {/* Zone image */}
      <div className="relative overflow-hidden bg-beige-100" style={{ aspectRatio: '4/5' }}>

        {/* Badge (Nouveau, Best-seller, etc.) */}
        {produit.badge && (
          <span className="absolute top-3 left-3 z-10 bg-brun-fonce text-beige-50 font-ui text-xs px-3 py-1 uppercase tracking-widest">
            {produit.badge}
          </span>
        )}

        {/* Image du sac */}
        <img
          src={produit.image}
          alt={produit.nom}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay au survol avec bouton rapide */}
        <div className="absolute inset-0 bg-brun-fonce/0 group-hover:bg-brun-fonce/20 transition-all duration-500 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onAjouterAuPanier(produit)}
            className="bg-white text-brun-fonce font-ui text-xs uppercase tracking-widest px-5 py-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-or-moyen hover:text-white"
          >
            Ajouter au panier
          </button>
        </div>
      </div>

      {/* Infos produit */}
      <div className="p-4 flex flex-col flex-1">

        {/* Couleur */}
        <p className="font-ui text-beige-400 uppercase tracking-widest mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.2em' }}>
          {produit.couleur}
        </p>

        {/* Nom */}
        <h3 className="font-display font-semibold text-brun-fonce text-lg mb-1 group-hover:text-or-accent transition-colors duration-300">
          {produit.nom}
        </h3>

        {/* Description courte */}
        <p className="font-body text-brun-clair text-sm leading-relaxed flex-1 mb-4" style={{ fontSize: '0.85rem' }}>
          {produit.description}
        </p>

        {/* Prix + bouton */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-beige-100">

          <div>
            <span className="font-display font-bold text-brun-fonce" style={{ fontSize: '1.1rem' }}>
              {produit.prix.toLocaleString('fr-DZ')}
            </span>
            <span className="font-ui text-brun-clair text-xs ml-1">DA</span>
          </div>

          <button
            onClick={() => onAjouterAuPanier(produit)}
            className="w-9 h-9 flex items-center justify-center border border-brun-fonce text-brun-fonce hover:bg-brun-fonce hover:text-beige-50 transition-all duration-300"
            aria-label={`Ajouter ${produit.nom} au panier`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}
