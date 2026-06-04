// =====================================================
// PRODUCT GRID – Grille de tous les produits (chargés depuis Supabase)
// =====================================================
import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { supabase } from '../lib/supabase'

// Imports statiques des images legacy — Vite les embarque et les hashe en prod.
// new URL(`../images/${variable}`, import.meta.url) ne fonctionne PAS en prod
// car Vite ne peut pas analyser les template literals avec variable.
import sac1 from '../images/sac1.png'
import sac2 from '../images/sac2.png'
import sac3 from '../images/sac3.png'
import sac4 from '../images/sac4.png'
import sac5 from '../images/sac5.png'
import sac6 from '../images/sac6.png'

const LEGACY_IMAGES = {
  'sac1.png': sac1,
  'sac2.png': sac2,
  'sac3.png': sac3,
  'sac4.png': sac4,
  'sac5.png': sac5,
  'sac6.png': sac6,
}

// URL Supabase complète → directe ; nom de fichier legacy → lookup statique
const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http')) return imageUrl
  return LEGACY_IMAGES[imageUrl] ?? ''
}

export default function ProductGrid({ onAjouterAuPanier }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id')

      if (error) {
        setError(error.message)
      } else {
        const produits = data.map((p) => ({
          ...p,
          image: resolveImageUrl(p.image_url),
        }))
        setProducts(produits)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  return (
    <section id="collection" className="py-20 px-4" style={{ background: '#fdfaf6' }}>
      <div className="max-w-6xl mx-auto">

        {/* En-tête de section */}
        <div className="text-center mb-14">
          <p className="font-ui uppercase tracking-widest text-or-accent text-xs mb-3" style={{ letterSpacing: '0.3em' }}>
            ✦ Notre Sélection ✦
          </p>

          <h2 className="font-display font-bold text-brun-fonce mb-4" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>
            La Collection
          </h2>

          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="gold-divider w-16" />
            <span className="text-or-accent text-xs">◆</span>
            <div className="gold-divider w-16" />
          </div>

          <p className="font-body italic text-brun-clair max-w-md mx-auto" style={{ fontSize: '1.05rem' }}>
            Des pièces soigneusement sélectionnées pour sublimer votre élégance au quotidien.
          </p>
        </div>

        {/* État de chargement */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-or-accent border-t-transparent rounded-full animate-spin" />
              <p className="font-ui text-xs uppercase tracking-widest text-brun-clair">
                Chargement de la collection…
              </p>
            </div>
          </div>
        )}

        {/* Erreur de chargement */}
        {error && (
          <div className="text-center py-20">
            <p className="font-body text-red-400 italic">
              Impossible de charger les produits. Veuillez réessayer.
            </p>
          </div>
        )}

        {/* Grille responsive : 1 col mobile, 2 col tablette, 3 col desktop */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {products.map((produit, index) => (
              <div
                key={produit.id}
                className="opacity-anim animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  produit={produit}
                  onAjouterAuPanier={onAjouterAuPanier}
                />
              </div>
            ))}
          </div>
        )}

        {/* Note de livraison sous la grille */}
        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-3 border border-beige-200 px-6 py-3 text-brun-clair font-ui text-xs uppercase tracking-widest">
            <svg className="w-4 h-4 text-or-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Livraison partout en Algérie – Paiement à la livraison
          </div>
        </div>

      </div>
    </section>
  )
}
