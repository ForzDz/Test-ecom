import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const STATUTS = ['en attente', 'confirmée', 'livrée', 'annulée']

const STATUT_STYLE = {
  'en attente': 'bg-amber-50  text-amber-700  border-amber-200',
  'confirmée':  'bg-blue-50   text-blue-700   border-blue-200',
  'livrée':     'bg-green-50  text-green-700  border-green-200',
  'annulée':    'bg-red-50    text-red-600    border-red-200',
}

export default function Commandes() {
  const [commandes, setCommandes]           = useState([])
  const [loading, setLoading]               = useState(true)
  const [erreur, setErreur]                 = useState(null)
  const [commandeOuverte, setCommandeOuverte] = useState(null)

  useEffect(() => { fetchCommandes() }, [])

  async function fetchCommandes() {
    setLoading(true)
    setErreur(null)
    try {
      // Jointure automatique via les FK Supabase :
      //   order_items.order_id   → orders.id
      //   order_items.product_id → products.id
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            product_id,
            products ( name, price )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCommandes(data)
    } catch (err) {
      console.error('fetchCommandes :', err)
      setErreur('Impossible de charger les commandes.')
    } finally {
      setLoading(false)
    }
  }

  async function changerStatut(commandeId, nouveauStatut) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: nouveauStatut })
        .eq('id', commandeId)

      if (error) throw error

      // Mise à jour locale sans refetch
      setCommandes((prev) =>
        prev.map((c) => c.id === commandeId ? { ...c, status: nouveauStatut } : c)
      )
    } catch (err) {
      console.error('changerStatut :', err)
    }
  }

  const formatDate = (str) => {
    if (!str) return '—'
    return new Date(str).toLocaleDateString('fr-DZ', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div className="p-6 lg:p-8">

      {/* En-tête */}
      <div className="mb-8">
        <p className="font-ui uppercase tracking-widest text-or-accent text-xs mb-1"
           style={{ letterSpacing: '0.3em' }}>
          Back-office
        </p>
        <h2 className="font-display font-bold text-brun-fonce text-3xl">Commandes</h2>
        <div className="gold-divider w-20 mt-3" />
      </div>

      {/* Chargement */}
      {loading && (
        <div className="flex items-center gap-3 text-brun-clair font-ui text-sm">
          <div className="w-5 h-5 border-2 border-or-accent border-t-transparent rounded-full animate-spin" />
          Chargement…
        </div>
      )}

      {/* Erreur */}
      {erreur && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 text-red-600 font-ui text-sm flex items-center gap-4">
          {erreur}
          <button onClick={fetchCommandes} className="underline">Réessayer</button>
        </div>
      )}

      {/* Vide */}
      {!loading && !erreur && commandes.length === 0 && (
        <p className="font-body italic text-brun-clair">Aucune commande pour le moment.</p>
      )}

      {/* Liste */}
      {!loading && !erreur && commandes.length > 0 && (
        <div className="space-y-4">
          {commandes.map((cmd) => (
            <div key={cmd.id} className="bg-white border border-beige-200 shadow-sm">

              {/* ── Ligne résumé ── */}
              <div className="px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-3">

                {/* Client */}
                <div className="flex-1 min-w-40">
                  <p className="font-display font-semibold text-brun-fonce">{cmd.customer_name}</p>
                  <p className="font-ui text-brun-clair text-xs mt-0.5">{cmd.customer_phone}</p>
                  <p className="font-ui text-brun-clair text-xs">{cmd.customer_wilaya} — {cmd.customer_commune}</p>
                </div>

                {/* Livraison */}
                <div className="text-center min-w-20">
                  <p className="font-ui text-brun-clair text-xs uppercase tracking-wider">Livraison</p>
                  <p className="font-ui text-brun-fonce text-sm mt-0.5">
                    {cmd.delivery_type === 'domicile' ? 'Domicile' : 'Stop Desk'}
                  </p>
                </div>

                {/* Total */}
                <div className="text-center min-w-24">
                  <p className="font-ui text-brun-clair text-xs uppercase tracking-wider">Total</p>
                  <p className="font-display font-bold text-brun-fonce">
                    {Number(cmd.total).toLocaleString('fr-DZ')} DA
                  </p>
                </div>

                {/* Date */}
                <div className="text-center min-w-32">
                  <p className="font-ui text-brun-clair text-xs uppercase tracking-wider">Date</p>
                  <p className="font-ui text-brun-fonce text-xs mt-0.5">{formatDate(cmd.created_at)}</p>
                </div>

                {/* Statut — select coloré */}
                <div className="min-w-32">
                  <p className="font-ui text-brun-clair text-xs uppercase tracking-wider mb-1">Statut</p>
                  <select
                    value={cmd.status || 'en attente'}
                    onChange={(e) => changerStatut(cmd.id, e.target.value)}
                    className={`font-ui text-xs border px-2 py-1.5 w-full cursor-pointer outline-none appearance-none ${
                      STATUT_STYLE[cmd.status || 'en attente']
                    }`}
                  >
                    {STATUTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Bouton articles */}
                <button
                  onClick={() => setCommandeOuverte(commandeOuverte === cmd.id ? null : cmd.id)}
                  className="font-ui text-xs text-brun-clair hover:text-brun-fonce uppercase tracking-wider border border-beige-200 px-3 py-1.5 transition-colors"
                >
                  {commandeOuverte === cmd.id ? 'Masquer' : 'Articles'}
                </button>
              </div>

              {/* ── Détail articles (accordéon) ── */}
              {commandeOuverte === cmd.id && (
                <div className="border-t border-beige-100 px-5 py-4 bg-beige-50/50">
                  <p className="font-ui text-xs uppercase tracking-wider text-brun-clair mb-3">
                    Détail des articles
                  </p>

                  <div className="space-y-2">
                    {cmd.order_items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between font-ui text-sm">
                        <span className="text-brun-fonce">
                          {item.products?.name ?? `Produit #${item.product_id}`} × {item.quantity}
                        </span>
                        <span className="text-brun-clair">
                          {item.products?.price
                            ? `${(Number(item.products.price) * item.quantity).toLocaleString('fr-DZ')} DA`
                            : '—'
                          }
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="font-ui text-xs text-brun-clair mt-3 pt-3 border-t border-beige-200">
                    Adresse : {cmd.customer_address}
                  </p>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
