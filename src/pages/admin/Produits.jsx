import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import sac1 from '../../images/sac1.png'
import sac2 from '../../images/sac2.png'
import sac3 from '../../images/sac3.png'
import sac4 from '../../images/sac4.png'
import sac5 from '../../images/sac5.png'
import sac6 from '../../images/sac6.png'

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

const FORM_VIDE   = { name: '', description: '', price: '', stock: '' }
const MAX_SIZE_MB = 5
const TYPES_OK    = ['image/jpeg', 'image/png', 'image/webp']

export default function Produits() {
  const [produits, setProduits]           = useState([])
  const [loading, setLoading]             = useState(true)
  const [erreur, setErreur]               = useState(null)

  const [formOuvert, setFormOuvert]       = useState(false)
  const [produitEdite, setProduitEdite]   = useState(null)
  const [form, setForm]                   = useState(FORM_VIDE)

  // États dédiés à l'image
  const [imageFile, setImageFile]         = useState(null)   // File sélectionné
  const [imagePreview, setImagePreview]   = useState(null)   // URL locale pour l'aperçu
  const [uploading, setUploading]         = useState(false)  // Phase upload Storage

  const [erreurForm, setErreurForm]       = useState(null)
  const [submitting, setSubmitting]       = useState(false)
  const [suppressionId, setSuppressionId] = useState(null)

  const fileInputRef = useRef(null)

  useEffect(() => { fetchProduits() }, [])

  // Libère la mémoire de l'aperçu local quand le composant est démonté
  useEffect(() => {
    return () => { if (imagePreview) URL.revokeObjectURL(imagePreview) }
  }, [imagePreview])

  async function fetchProduits() {
    setLoading(true)
    setErreur(null)
    try {
      const { data, error } = await supabase
        .from('products').select('*').order('id')
      if (error) throw error
      setProduits(data)
    } catch (err) {
      console.error('fetchProduits :', err)
      setErreur('Impossible de charger les produits.')
    } finally {
      setLoading(false)
    }
  }

  function ouvrirAjout() {
    setProduitEdite(null)
    setForm(FORM_VIDE)
    resetImage()
    setErreurForm(null)
    setFormOuvert(true)
  }

  function ouvrirEdition(produit) {
    setProduitEdite(produit)
    setForm({
      name:        produit.name        ?? '',
      description: produit.description ?? '',
      price:       String(produit.price ?? ''),
      stock:       String(produit.stock ?? ''),
    })
    resetImage()
    setErreurForm(null)
    setFormOuvert(true)
  }

  function fermerForm() {
    setFormOuvert(false)
    setProduitEdite(null)
    setForm(FORM_VIDE)
    resetImage()
    setErreurForm(null)
  }

  function resetImage() {
    setImageFile(null)
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Sélection + validation immédiate du fichier ──────────────────────────
  function handleSelectImage(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!TYPES_OK.includes(file.type)) {
      setErreurForm('Format non supporté. Utilisez JPG, PNG ou WebP.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErreurForm(`Image trop volumineuse. Maximum ${MAX_SIZE_MB} Mo.`)
      e.target.value = ''
      return
    }

    setErreurForm(null)
    setImageFile(file)
    // Génère un aperçu local immédiat (sans uploader encore)
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }

  // ── Validation des champs texte ──────────────────────────────────────────
  function validerForm() {
    if (!form.name.trim())                        return 'Le nom est obligatoire.'
    if (!form.price || isNaN(Number(form.price))) return 'Le prix doit être un nombre valide.'
    if (!produitEdite && !imageFile)              return 'Veuillez sélectionner une image.'
    return null
  }

  // ── Soumission : upload image → insert/update produit ───────────────────
  async function handleSubmitForm(e) {
    e.preventDefault()
    const err = validerForm()
    if (err) { setErreurForm(err); return }

    setSubmitting(true)
    setErreurForm(null)

    try {
      // ── Étape 1 : upload dans Supabase Storage (si nouvelle image) ──────
      // On garde l'URL existante si pas de nouveau fichier (cas édition)
      let finalImageUrl = produitEdite?.image_url ?? ''

      if (imageFile) {
        const ext  = imageFile.name.split('.').pop().toLowerCase()
        // Nom unique : timestamp + 6 chars aléatoires → jamais de collision
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

        setUploading(true)
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(path, imageFile)
        setUploading(false)

        if (uploadError) throw uploadError

        // getPublicUrl est synchrone — renvoie directement l'URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(path)

        finalImageUrl = publicUrl
      }

      // ── Étape 2 : insert / update dans la table products ────────────────
      const payload = {
        name:        form.name.trim(),
        description: form.description.trim(),
        price:       Number(form.price),
        image_url:   finalImageUrl,
        stock:       form.stock !== '' ? Number(form.stock) : null,
      }

      if (produitEdite) {
        const { error } = await supabase
          .from('products').update(payload).eq('id', produitEdite.id)
        if (error) throw error
        setProduits((prev) =>
          prev.map((p) => p.id === produitEdite.id ? { ...p, ...payload } : p)
        )
      } else {
        const { data, error } = await supabase
          .from('products').insert(payload).select().single()
        if (error) throw error
        setProduits((prev) => [...prev, data])
      }

      fermerForm()
    } catch (err) {
      console.error('handleSubmitForm :', err)
      setUploading(false)
      setErreurForm('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  async function supprimerProduit(id) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      setProduits((prev) => prev.filter((p) => p.id !== id))
      setSuppressionId(null)
    } catch (err) {
      console.error('supprimerProduit :', err)
    }
  }

  const setChamp = (champ) => (e) =>
    setForm((prev) => ({ ...prev, [champ]: e.target.value }))

  // Label contextuel du bouton de soumission
  const labelBouton = uploading
    ? "Envoi de l'image…"
    : submitting
      ? 'Enregistrement…'
      : produitEdite
        ? 'Enregistrer les modifications'
        : 'Ajouter le produit'

  // URL d'aperçu : fichier local sélectionné > image actuelle du produit
  const apercuUrl = imagePreview ?? resolveImageUrl(produitEdite?.image_url ?? '')

  return (
    <div className="p-6 lg:p-8">

      {/* En-tête */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-ui uppercase tracking-widest text-or-accent text-xs mb-1"
             style={{ letterSpacing: '0.3em' }}>
            Back-office
          </p>
          <h2 className="font-display font-bold text-brun-fonce text-3xl">Produits</h2>
          <div className="gold-divider w-20 mt-3" />
        </div>
        <button onClick={ouvrirAjout} className="btn-primary flex items-center gap-2 mt-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-brun-clair font-ui text-sm">
          <div className="w-5 h-5 border-2 border-or-accent border-t-transparent rounded-full animate-spin" />
          Chargement…
        </div>
      )}

      {erreur && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 text-red-600 font-ui text-sm">{erreur}</div>
      )}

      {/* Liste des produits */}
      {!loading && !erreur && (
        <div className="space-y-3">
          {produits.length === 0 && (
            <p className="font-body italic text-brun-clair">Aucun produit. Ajoutez-en un.</p>
          )}

          {produits.map((produit) => (
            <div key={produit.id} className="bg-white border border-beige-200 shadow-sm">
              <div className="px-5 py-4 flex items-center gap-4">

                <div className="w-12 h-14 bg-beige-100 flex-shrink-0 overflow-hidden">
                  <img
                    src={resolveImageUrl(produit.image_url)}
                    alt={produit.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.opacity = '0' }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-brun-fonce">{produit.name}</p>
                  <p className="font-ui text-brun-clair text-xs mt-0.5 truncate">{produit.description}</p>
                </div>

                <div className="text-right min-w-24 flex-shrink-0">
                  <p className="font-display font-bold text-brun-fonce">
                    {Number(produit.price).toLocaleString('fr-DZ')} DA
                  </p>
                  {produit.stock != null && (
                    <p className="font-ui text-brun-clair text-xs mt-0.5">Stock : {produit.stock}</p>
                  )}
                </div>

                {suppressionId === produit.id ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-ui text-xs text-brun-clair whitespace-nowrap">Supprimer ?</span>
                    <button
                      onClick={() => supprimerProduit(produit.id)}
                      className="font-ui text-xs text-red-600 border border-red-200 px-2 py-1 hover:bg-red-50 transition-colors"
                    >Oui</button>
                    <button
                      onClick={() => setSuppressionId(null)}
                      className="font-ui text-xs text-brun-clair border border-beige-200 px-2 py-1 hover:bg-beige-50 transition-colors"
                    >Non</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => ouvrirEdition(produit)}
                      className="font-ui text-xs text-brun-clair border border-beige-200 px-3 py-1.5 hover:border-brun-fonce hover:text-brun-fonce transition-colors"
                    >Modifier</button>
                    <button
                      onClick={() => setSuppressionId(produit.id)}
                      className="font-ui text-xs text-red-500 border border-red-100 px-3 py-1.5 hover:bg-red-50 transition-colors"
                    >Supprimer</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Drawer formulaire ── */}
      {formOuvert && (
        <>
          <div className="fixed inset-0 z-40 modal-overlay" onClick={fermerForm} />

          <aside className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-beige-50 shadow-2xl flex flex-col animate-slide-in">

            <div className="flex items-center justify-between px-6 py-5 border-b border-beige-200">
              <h3 className="font-display font-bold text-brun-fonce text-xl">
                {produitEdite ? 'Modifier le produit' : 'Nouveau produit'}
              </h3>
              <button
                onClick={fermerForm}
                className="w-9 h-9 flex items-center justify-center border border-beige-300 text-brun-clair hover:border-brun-fonce hover:text-brun-fonce transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

              <div>
                <label className="form-label">Nom du produit *</label>
                <input type="text" value={form.name} onChange={setChamp('name')}
                  placeholder="Sac Jasmine" className="form-input" />
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea value={form.description} onChange={setChamp('description')}
                  placeholder="Description du produit…" rows={3}
                  className="form-input resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Prix (DA) *</label>
                  <input type="number" value={form.price} onChange={setChamp('price')}
                    placeholder="3800" className="form-input" min="0" />
                </div>
                <div>
                  <label className="form-label">Stock</label>
                  <input type="number" value={form.stock} onChange={setChamp('stock')}
                    placeholder="10" className="form-input" min="0" />
                </div>
              </div>

              {/* ── Zone image ── */}
              <div>
                <label className="form-label">
                  Image {!produitEdite && '*'}
                </label>

                {/* Aperçu : fichier local sélectionné OU image actuelle en édition */}
                {apercuUrl && (
                  <div className="mb-3 relative inline-block">
                    <img
                      src={apercuUrl}
                      alt="Aperçu"
                      className="w-24 h-28 object-cover border border-beige-200 bg-beige-100"
                    />
                    {imageFile && (
                      <button
                        type="button"
                        onClick={resetImage}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-brun-fonce text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        title="Retirer l'image"
                      >✕</button>
                    )}
                  </div>
                )}

                {/* Zone de drop cliquable */}
                <label className={`flex flex-col items-center gap-2 border-2 border-dashed p-5 cursor-pointer transition-colors duration-200 ${
                  imageFile ? 'border-or-accent bg-or-clair/10' : 'border-beige-300 hover:border-or-accent'
                }`}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleSelectImage}
                    className="sr-only"
                    disabled={submitting}
                  />

                  <svg className="w-6 h-6 text-brun-clair" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>

                  <div className="text-center">
                    <p className="font-ui text-brun-fonce text-xs font-medium">
                      {imageFile ? imageFile.name : 'Cliquez pour choisir une image'}
                    </p>
                    {imageFile ? (
                      <p className="font-ui text-brun-clair text-xs mt-0.5">
                        {(imageFile.size / 1024 / 1024).toFixed(2)} Mo
                      </p>
                    ) : (
                      <p className="font-ui text-brun-clair text-xs mt-0.5">
                        JPG, PNG, WebP — max {MAX_SIZE_MB} Mo
                      </p>
                    )}
                  </div>
                </label>

                {produitEdite && !imageFile && (
                  <p className="font-ui text-brun-clair text-xs mt-1.5">
                    Laissez vide pour conserver l'image actuelle.
                  </p>
                )}
              </div>

              {erreurForm && (
                <p className="font-ui text-red-500 text-xs bg-red-50 border border-red-200 px-4 py-3">
                  {erreurForm}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {labelBouton}
              </button>

            </form>
          </aside>
        </>
      )}
    </div>
  )
}
