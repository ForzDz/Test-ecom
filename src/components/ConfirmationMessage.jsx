// =====================================================
// CONFIRMATION MESSAGE – Affiché après commande validée
// =====================================================

export default function ConfirmationMessage({ commande, onFermer }) {
  return (
    <>
      {/* Fond assombri */}
      <div className="fixed inset-0 z-50 modal-overlay animate-fade-in" aria-hidden="true" />

      {/* Modale de confirmation */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-beige-50 shadow-2xl animate-fade-up text-center px-8 py-12">

          {/* Icône de succès */}
          <div className="w-16 h-16 rounded-full bg-or-clair flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-or-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Ornement doré */}
          <p className="font-ui uppercase tracking-widest text-or-accent text-xs mb-3" style={{ letterSpacing: '0.3em' }}>
            ✦ Merci ✦
          </p>

          {/* Titre */}
          <h2 className="font-display font-bold text-brun-fonce text-2xl mb-2">
            Commande Confirmée !
          </h2>

          <p className="font-body italic text-brun-clair mb-6" style={{ fontSize: '1.05rem' }}>
            Votre commande a bien été enregistrée,{' '}
            <strong className="text-brun-fonce not-italic">{commande.prenom}</strong>.
          </p>

          <div className="gold-divider mb-6" />

          {/* Détails de la commande */}
          <div className="bg-white border border-beige-200 p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between font-ui text-sm">
              <span className="text-brun-clair">Nom</span>
              <span className="text-brun-fonce font-medium">{commande.prenom} {commande.nom}</span>
            </div>
            <div className="flex justify-between font-ui text-sm">
              <span className="text-brun-clair">Téléphone</span>
              <span className="text-brun-fonce font-medium">{commande.telephone}</span>
            </div>
            <div className="flex justify-between font-ui text-sm">
              <span className="text-brun-clair">Wilaya</span>
              <span className="text-brun-fonce font-medium">{commande.wilaya}</span>
            </div>
            <div className="flex justify-between font-ui text-sm">
              <span className="text-brun-clair">Livraison</span>
              <span className="text-brun-fonce font-medium">
                {commande.typeLivraison === 'domicile' ? 'Domicile' : 'Stop Desk'}
              </span>
            </div>
            <div className="gold-divider" />
            <div className="flex justify-between font-display font-bold text-brun-fonce text-lg">
              <span>Total à payer</span>
              <span>{commande.total.toLocaleString('fr-DZ')} DA</span>
            </div>
          </div>

          <p className="font-ui text-brun-clair text-sm mb-6">
            Notre équipe vous contactera dans les <strong>24h</strong> pour confirmer la livraison. 💛
          </p>

          {/* Bouton retour */}
          <button onClick={onFermer} className="btn-primary w-full">
            Retour à la boutique
          </button>
        </div>
      </div>
    </>
  )
}
