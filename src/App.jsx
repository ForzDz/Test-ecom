// =====================================================
// APP.JSX – Composant racine, gestion du state global
// =====================================================
import { useState, useCallback } from 'react'
import Header              from './components/Header'
import Hero                from './components/Hero'
import ProductGrid         from './components/ProductGrid'
import Cart                from './components/Cart'
import OrderForm           from './components/OrderForm'
import ConfirmationMessage from './components/ConfirmationMessage'
import Footer              from './components/Footer'

export default function App() {

  // ---- État du panier ----
  // Chaque item = { ...produit, quantite }
  const [panier, setPanier] = useState([])

  // ---- Visibilité des panneaux ----
  const [panierOuvert,    setPanierOuvert]    = useState(false)
  const [formulaireOuvert, setFormulaireOuvert] = useState(false)
  const [commande,         setCommande]         = useState(null) // données de la commande confirmée

  // ---- Nombre total d'articles dans le panier ----
  const nbArticles = panier.reduce((acc, item) => acc + item.quantite, 0)

  // ---- Ajouter un produit au panier ----
  const ajouterAuPanier = useCallback((produit) => {
    setPanier((prev) => {
      const existe = prev.find((item) => item.id === produit.id)
      if (existe) {
        // Si déjà présent, on augmente la quantité
        return prev.map((item) =>
          item.id === produit.id
            ? { ...item, quantite: item.quantite + 1 }
            : item
        )
      }
      // Sinon, on l'ajoute avec quantite = 1
      return [...prev, { ...produit, quantite: 1 }]
    })
    // Ouvrir le panier automatiquement
    setPanierOuvert(true)
  }, [])

  // ---- Modifier la quantité d'un article ----
  const modifierQuantite = useCallback((id, nouvelleQte) => {
    if (nouvelleQte <= 0) {
      // Quantité à 0 → supprimer l'article
      setPanier((prev) => prev.filter((item) => item.id !== id))
    } else {
      setPanier((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantite: nouvelleQte } : item
        )
      )
    }
  }, [])

  // ---- Supprimer un article du panier ----
  const supprimerItem = useCallback((id) => {
    setPanier((prev) => prev.filter((item) => item.id !== id))
  }, [])

  // ---- Ouvrir le formulaire de commande ----
  const ouvrirFormulaire = () => {
    setPanierOuvert(false)
    setFormulaireOuvert(true)
  }

  // ---- Confirmer la commande ----
  const confirmerCommande = (donnees) => {
    setFormulaireOuvert(false)
    setCommande(donnees)
    // Vider le panier après confirmation
    setPanier([])
  }

  // ---- Fermer la confirmation et retour boutique ----
  const fermerConfirmation = () => {
    setCommande(null)
  }

  // ---- Scroller vers la collection ----
  const scrollVersCollection = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col">

      {/* Header fixe */}
      <Header
        nbArticles={nbArticles}
        onOuvrirPanier={() => setPanierOuvert(true)}
      />

      {/* Contenu principal */}
      <main className="flex-1">

        {/* Section 1 : Hero */}
        <Hero onDecouvrir={scrollVersCollection} />

        {/* Séparateur doré */}
        <div className="gold-divider" />

        {/* Section 2 : Grille produits */}
        <ProductGrid onAjouterAuPanier={ajouterAuPanier} />

      </main>

      {/* Footer */}
      <Footer />

      {/* ---- Panneaux modaux ---- */}

      {/* Panier (drawer latéral) */}
      {panierOuvert && (
        <Cart
          panier={panier}
          onFermer={() => setPanierOuvert(false)}
          onModifierQte={modifierQuantite}
          onSupprimerItem={supprimerItem}
          onCommander={ouvrirFormulaire}
        />
      )}

      {/* Formulaire de commande */}
      {formulaireOuvert && (
        <OrderForm
          panier={panier}
          onFermer={() => setFormulaireOuvert(false)}
          onConfirmer={confirmerCommande}
        />
      )}

      {/* Message de confirmation */}
      {commande && (
        <ConfirmationMessage
          commande={commande}
          onFermer={fermerConfirmation}
        />
      )}

    </div>
  )
}
