// =====================================================
// PRODUCT GRID – Grille de tous les produits
// =====================================================
import ProductCard from './ProductCard'
import { products } from '../data/products'

export default function ProductGrid({ onAjouterAuPanier }) {
  return (
    <section id="collection" className="py-20 px-4" style={{ background: '#fdfaf6' }}>
      <div className="max-w-6xl mx-auto">

        {/* En-tête de section */}
        <div className="text-center mb-14">
          {/* Ornement doré */}
          <p className="font-ui uppercase tracking-widest text-or-accent text-xs mb-3" style={{ letterSpacing: '0.3em' }}>
            ✦ Notre Sélection ✦
          </p>

          <h2 className="font-display font-bold text-brun-fonce mb-4" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>
            La Collection
          </h2>

          {/* Ligne décorative */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="gold-divider w-16" />
            <span className="text-or-accent text-xs">◆</span>
            <div className="gold-divider w-16" />
          </div>

          <p className="font-body italic text-brun-clair max-w-md mx-auto" style={{ fontSize: '1.05rem' }}>
            Des pièces soigneusement sélectionnées pour sublimer votre élégance au quotidien.
          </p>
        </div>

        {/* Grille responsive : 1 col mobile, 2 col tablette, 3 col desktop */}
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
