// =====================================================
// CART – Panneau latéral panier (drawer)
// =====================================================

export default function Cart({ panier, onFermer, onModifierQte, onSupprimerItem, onCommander }) {

  // Calcul du total articles (sans livraison)
  const sousTotal = panier.reduce((acc, item) => acc + item.prix * item.quantite, 0)

  return (
    <>
      {/* Fond assombri cliquable */}
      <div
        className="fixed inset-0 z-50 modal-overlay animate-fade-in"
        onClick={onFermer}
        aria-hidden="true"
      />

      {/* Panneau latéral */}
      <aside className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-beige-50 shadow-2xl flex flex-col animate-slide-in">

        {/* En-tête du panier */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-beige-200">
          <div>
            <h2 className="font-display font-bold text-brun-fonce text-xl">Mon Panier</h2>
            <p className="font-ui text-brun-clair text-xs mt-0.5">
              {panier.length === 0 ? 'Vide' : `${panier.reduce((a, i) => a + i.quantite, 0)} article(s)`}
            </p>
          </div>
          <button
            onClick={onFermer}
            className="w-9 h-9 flex items-center justify-center border border-beige-300 text-brun-clair hover:border-brun-fonce hover:text-brun-fonce transition-all duration-300"
            aria-label="Fermer le panier"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Liste des articles */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {panier.length === 0 ? (
            /* Panier vide */
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <svg className="w-16 h-16 text-beige-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="font-display italic text-brun-clair text-lg mb-1">Votre panier est vide</p>
              <p className="font-ui text-brun-clair text-xs">Ajoutez des sacs pour commencer</p>
            </div>
          ) : (
            /* Articles */
            <ul className="space-y-4">
              {panier.map((item) => (
                <li key={item.id} className="flex gap-4 pb-4 border-b border-beige-100">

                  {/* Miniature */}
                  <div className="w-20 h-24 flex-shrink-0 bg-beige-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.nom}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Détails */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-brun-fonce text-sm">{item.nom}</h3>
                    <p className="font-ui text-brun-clair text-xs mt-0.5">{item.couleur}</p>

                    {/* Prix unitaire */}
                    <p className="font-display text-brun-fonce text-sm mt-1">
                      {item.prix.toLocaleString('fr-DZ')} DA
                    </p>

                    {/* Contrôle quantité */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onModifierQte(item.id, item.quantite - 1)}
                        className="w-7 h-7 flex items-center justify-center border border-beige-300 text-brun-clair hover:border-brun-fonce hover:text-brun-fonce transition-all duration-200"
                        aria-label="Diminuer la quantité"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>

                      <span className="font-ui font-medium text-brun-fonce text-sm w-6 text-center">
                        {item.quantite}
                      </span>

                      <button
                        onClick={() => onModifierQte(item.id, item.quantite + 1)}
                        className="w-7 h-7 flex items-center justify-center border border-beige-300 text-brun-clair hover:border-brun-fonce hover:text-brun-fonce transition-all duration-200"
                        aria-label="Augmenter la quantité"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>

                      {/* Supprimer */}
                      <button
                        onClick={() => onSupprimerItem(item.id)}
                        className="ml-auto text-beige-400 hover:text-rose-fonce transition-colors duration-200"
                        aria-label={`Supprimer ${item.nom}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pied du panier – Total + bouton commander */}
        {panier.length > 0 && (
          <div className="px-6 py-5 border-t border-beige-200 bg-white">

            {/* Sous-total */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-ui text-brun-clair text-sm">Sous-total</span>
              <span className="font-display font-semibold text-brun-fonce">
                {sousTotal.toLocaleString('fr-DZ')} DA
              </span>
            </div>

            <p className="font-ui text-brun-clair text-xs mb-4">
              + Frais de livraison calculés à la commande
            </p>

            {/* Ligne dorée */}
            <div className="gold-divider mb-4" />

            {/* Bouton Commander */}
            <button
              onClick={onCommander}
              className="btn-primary w-full text-center block"
            >
              Commander – Paiement à la livraison
            </button>

            <p className="font-ui text-brun-clair text-xs text-center mt-3">
              Livraison disponible partout en Algérie
            </p>
          </div>
        )}
      </aside>
    </>
  )
}
