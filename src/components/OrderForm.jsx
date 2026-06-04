// =====================================================
// ORDER FORM – Formulaire de commande (paiement à la livraison)
// =====================================================
import { useState } from 'react'
import { wilayas, fraisLivraison } from '../data/products'
import { supabase } from '../lib/supabase'

export default function OrderForm({ panier, onFermer, onConfirmer }) {

  // État du formulaire
  const [form, setForm] = useState({
    prenom:       '',
    nom:          '',
    telephone:    '',
    wilaya:       '',
    commune:      '',
    adresse:      '',
    typeLivraison: 'domicile',
  })

  // Erreurs de validation
  const [erreurs, setErreurs] = useState({})

  // État de soumission vers Supabase
  const [submitting, setSubmitting]       = useState(false)
  const [erreurServeur, setErreurServeur] = useState(null)

  // Calculs
  const sousTotal     = panier.reduce((acc, item) => acc + Number(item.price) * item.quantite, 0)
  const frais         = fraisLivraison[form.typeLivraison]
  const total         = sousTotal + frais

  // Mise à jour d'un champ
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (erreurs[name]) setErreurs((prev) => ({ ...prev, [name]: '' }))
  }

  // Validation avant soumission
  const valider = () => {
    const nouvellesErreurs = {}
    if (!form.prenom.trim())    nouvellesErreurs.prenom    = 'Champ obligatoire'
    if (!form.nom.trim())       nouvellesErreurs.nom       = 'Champ obligatoire'
    if (!form.telephone.trim()) nouvellesErreurs.telephone = 'Champ obligatoire'
    else if (!/^(0[5-7]\d{8})$/.test(form.telephone.replace(/\s/g, '')))
      nouvellesErreurs.telephone = 'Numéro algérien invalide (ex: 0551234567)'
    if (!form.wilaya)           nouvellesErreurs.wilaya    = 'Choisissez une wilaya'
    if (!form.commune.trim())   nouvellesErreurs.commune   = 'Champ obligatoire'
    if (!form.adresse.trim())   nouvellesErreurs.adresse   = 'Champ obligatoire'
    return nouvellesErreurs
  }

  // Soumission du formulaire → sauvegarde dans Supabase
  const handleSubmit = async (e) => {
    e.preventDefault()
    const nouvellesErreurs = valider()
    if (Object.keys(nouvellesErreurs).length > 0) {
      setErreurs(nouvellesErreurs)
      return
    }

    setSubmitting(true)
    setErreurServeur(null)

    try {
      // ── Étape 1 : créer la commande dans "orders" ──────────────────────
      // On insère une ligne et on demande à Supabase de nous retourner
      // l'id généré (.select('id').single() → un seul objet, pas un tableau)
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name:    `${form.prenom} ${form.nom}`,
          customer_phone:   form.telephone,
          customer_wilaya:  form.wilaya,
          customer_commune: form.commune,
          customer_address: form.adresse,
          delivery_type:    form.typeLivraison,
          total,
        })
        .select('id')
        .single()

      if (orderError) throw orderError

      // ── Étape 2 : insérer les articles dans "order_items" ──────────────
      // Chaque ligne porte order_id = id de la commande créée ci-dessus.
      // C'est la clé étrangère qui lie les articles à leur commande.
      const lignesArticles = panier.map((item) => ({
        order_id:   order.id,
        product_id: item.id,
        quantity:   item.quantite,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(lignesArticles)

      if (itemsError) throw itemsError

      // ── Étape 3 : tout a réussi → confirmer et vider le panier ─────────
      onConfirmer({ ...form, panier, sousTotal, frais, total })

    } catch (err) {
      console.error('Erreur lors de la sauvegarde de la commande :', err)
      setErreurServeur('Une erreur est survenue. Veuillez réessayer ou nous contacter.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Fond assombri */}
      <div
        className="fixed inset-0 z-50 modal-overlay animate-fade-in"
        onClick={onFermer}
        aria-hidden="true"
      />

      {/* Modale formulaire */}
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
        <div
          className="relative w-full max-w-lg bg-beige-50 shadow-2xl animate-fade-up"
          onClick={(e) => e.stopPropagation()}
        >

          {/* En-tête */}
          <div className="px-6 pt-6 pb-4 border-b border-beige-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-brun-fonce text-2xl">Votre Commande</h2>
                <p className="font-ui text-brun-clair text-xs mt-1 uppercase tracking-widest">
                  Paiement à la livraison · Cash on delivery
                </p>
              </div>
              <button
                onClick={onFermer}
                className="w-9 h-9 flex items-center justify-center border border-beige-300 text-brun-clair hover:border-brun-fonce hover:text-brun-fonce transition-all"
                aria-label="Fermer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Récapitulatif des articles */}
            <div className="mt-4 bg-white border border-beige-200 p-3">
              {panier.map((item) => (
                <div key={item.id} className="flex justify-between font-ui text-sm text-brun-clair py-1">
                  <span>{item.name} × {item.quantite}</span>
                  <span className="font-medium text-brun-fonce">{(Number(item.price) * item.quantite).toLocaleString('fr-DZ')} DA</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5" noValidate>

            {/* Nom & Prénom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="prenom" className="form-label">Prénom *</label>
                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  value={form.prenom}
                  onChange={handleChange}
                  placeholder="Fatima"
                  className={`form-input ${erreurs.prenom ? 'border-red-400' : ''}`}
                  autoComplete="given-name"
                />
                {erreurs.prenom && <p className="text-red-500 font-ui text-xs mt-1">{erreurs.prenom}</p>}
              </div>

              <div>
                <label htmlFor="nom" className="form-label">Nom *</label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Boudiaf"
                  className={`form-input ${erreurs.nom ? 'border-red-400' : ''}`}
                  autoComplete="family-name"
                />
                {erreurs.nom && <p className="text-red-500 font-ui text-xs mt-1">{erreurs.nom}</p>}
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="telephone" className="form-label">Numéro de téléphone *</label>
              <input
                id="telephone"
                name="telephone"
                type="tel"
                value={form.telephone}
                onChange={handleChange}
                placeholder="0551 234 567"
                className={`form-input ${erreurs.telephone ? 'border-red-400' : ''}`}
                autoComplete="tel"
                inputMode="numeric"
              />
              {erreurs.telephone && <p className="text-red-500 font-ui text-xs mt-1">{erreurs.telephone}</p>}
            </div>

            {/* Wilaya */}
            <div>
              <label htmlFor="wilaya" className="form-label">Wilaya *</label>
              <div className="relative">
                <select
                  id="wilaya"
                  name="wilaya"
                  value={form.wilaya}
                  onChange={handleChange}
                  className={`form-input appearance-none pr-8 cursor-pointer ${erreurs.wilaya ? 'border-red-400' : ''}`}
                >
                  <option value="">-- Choisissez votre wilaya --</option>
                  {wilayas.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
                {/* Flèche du select */}
                <svg
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-brun-clair pointer-events-none"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {erreurs.wilaya && <p className="text-red-500 font-ui text-xs mt-1">{erreurs.wilaya}</p>}
            </div>

            {/* Commune */}
            <div>
              <label htmlFor="commune" className="form-label">Commune *</label>
              <input
                id="commune"
                name="commune"
                type="text"
                value={form.commune}
                onChange={handleChange}
                placeholder="Ex : Hussein Dey"
                className={`form-input ${erreurs.commune ? 'border-red-400' : ''}`}
              />
              {erreurs.commune && <p className="text-red-500 font-ui text-xs mt-1">{erreurs.commune}</p>}
            </div>

            {/* Adresse */}
            <div>
              <label htmlFor="adresse" className="form-label">Adresse complète *</label>
              <input
                id="adresse"
                name="adresse"
                type="text"
                value={form.adresse}
                onChange={handleChange}
                placeholder="Ex : Rue des Roses, Cité 500 Logements"
                className={`form-input ${erreurs.adresse ? 'border-red-400' : ''}`}
                autoComplete="street-address"
              />
              {erreurs.adresse && <p className="text-red-500 font-ui text-xs mt-1">{erreurs.adresse}</p>}
            </div>

            {/* Type de livraison */}
            <div>
              <p className="form-label mb-3">Type de livraison *</p>
              <div className="grid grid-cols-2 gap-3">

                {/* Option Domicile */}
                <label
                  className={`flex flex-col items-center gap-2 p-4 border-2 cursor-pointer transition-all duration-300 ${
                    form.typeLivraison === 'domicile'
                      ? 'border-or-accent bg-or-clair/30 text-brun-fonce'
                      : 'border-beige-200 text-brun-clair hover:border-beige-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="typeLivraison"
                    value="domicile"
                    checked={form.typeLivraison === 'domicile'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <div className="text-center">
                    <p className="font-ui font-medium text-xs uppercase tracking-wider">Domicile</p>
                    <p className="font-display font-bold text-sm">600 DA</p>
                  </div>
                </label>

                {/* Option Stop Desk */}
                <label
                  className={`flex flex-col items-center gap-2 p-4 border-2 cursor-pointer transition-all duration-300 ${
                    form.typeLivraison === 'stopDesk'
                      ? 'border-or-accent bg-or-clair/30 text-brun-fonce'
                      : 'border-beige-200 text-brun-clair hover:border-beige-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="typeLivraison"
                    value="stopDesk"
                    checked={form.typeLivraison === 'stopDesk'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="text-center">
                    <p className="font-ui font-medium text-xs uppercase tracking-wider">Stop Desk</p>
                    <p className="font-display font-bold text-sm">400 DA</p>
                  </div>
                </label>
              </div>
            </div>

            {/* ---- Récapitulatif total ---- */}
            <div className="bg-white border border-beige-200 p-4 space-y-2">
              <div className="flex justify-between font-ui text-sm text-brun-clair">
                <span>Sous-total</span>
                <span>{sousTotal.toLocaleString('fr-DZ')} DA</span>
              </div>
              <div className="flex justify-between font-ui text-sm text-brun-clair">
                <span>Frais de livraison ({form.typeLivraison === 'domicile' ? 'Domicile' : 'Stop Desk'})</span>
                <span>{frais} DA</span>
              </div>
              <div className="gold-divider" />
              <div className="flex justify-between font-display font-bold text-brun-fonce text-lg">
                <span>Total à payer</span>
                <span>{total.toLocaleString('fr-DZ')} DA</span>
              </div>
              <p className="font-ui text-or-accent text-xs text-center uppercase tracking-widest pt-1">
                Paiement en espèces à la livraison
              </p>
            </div>

            {/* Bouton de confirmation */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full text-center flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enregistrement…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirmer la commande
                </>
              )}
            </button>

            {/* Message d'erreur serveur */}
            {erreurServeur && (
              <p className="font-ui text-red-500 text-xs text-center bg-red-50 border border-red-200 px-4 py-3">
                {erreurServeur}
              </p>
            )}

            <p className="font-ui text-brun-clair text-xs text-center">
              En confirmant, vous acceptez d'être contactée pour la livraison.
            </p>

          </form>
        </div>
      </div>
    </>
  )
}
