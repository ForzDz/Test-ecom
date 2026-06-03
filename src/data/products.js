// =====================================================
// DONNÉES PRODUITS – Women Hood
// Images situées dans src/images/
// Prix en Dinars Algériens (DA)
// =====================================================

import sac1 from '../images/sac1.png'
import sac2 from '../images/sac2.png'
import sac3 from '../images/sac3.png'
import sac4 from '../images/sac4.png'
import sac5 from '../images/sac5.png'
import sac6 from '../images/sac6.png'

export const products = [
  {
    id: 1,
    nom: 'Sac Jasmine',
    description: 'Sac à main en cuir végétalien caramel, fermeture dorée et bandoulière amovible.',
    prix: 3800,
    image: sac1,
    badge: 'Nouveau',
    couleur: 'Caramel',
  },
  {
    id: 2,
    nom: 'Sac Fairouz',
    description: 'Pochette structurée en similicuir beige, détails en métal doré, idéale pour les soirées.',
    prix: 2900,
    image: sac2,
    badge: null,
    couleur: 'Beige',
  },
  {
    id: 3,
    nom: 'Sac Nadia',
    description: 'Grand cabas en cuir texturé ivoire, intérieur doublé, spacieux et élégant au quotidien.',
    prix: 5500,
    image: sac3,
    badge: 'Best-seller',
    couleur: 'Ivoire',
  },
  {
    id: 4,
    nom: 'Sac Leila',
    description: 'Mini sac crossbody en cuir noir brillant, chaîne dorée, style parisien intemporel.',
    prix: 4200,
    image: sac4,
    badge: null,
    couleur: 'Noir',
  },
  {
    id: 5,
    nom: 'Sac Yasmine',
    description: 'Sac hobo en daim rose poudré, souple et léger, fermoir magnétique discret.',
    prix: 3200,
    image: sac5,
    badge: 'Coup de cœur',
    couleur: 'Rose poudré',
  },
  {
    id: 6,
    nom: 'Sac Soraya',
    description: 'Sac trapèze en cuir cognac, double poignée et bandoulière longue, look bohème chic.',
    prix: 4800,
    image: sac6,
    badge: null,
    couleur: 'Cognac',
  },
]

// Frais de livraison selon le type choisi
export const fraisLivraison = {
  domicile:  600,
  stopDesk: 400,
}

// Les 58 wilayas algériennes (numéro + nom)
export const wilayas = [
  '01 – Adrar',
  '02 – Chlef',
  '03 – Laghouat',
  '04 – Oum El Bouaghi',
  '05 – Batna',
  '06 – Béjaïa',
  '07 – Biskra',
  '08 – Béchar',
  '09 – Blida',
  '10 – Bouira',
  '11 – Tamanrasset',
  '12 – Tébessa',
  '13 – Tlemcen',
  '14 – Tiaret',
  '15 – Tizi Ouzou',
  '16 – Alger',
  '17 – Djelfa',
  '18 – Jijel',
  '19 – Sétif',
  '20 – Saïda',
  '21 – Skikda',
  '22 – Sidi Bel Abbès',
  '23 – Annaba',
  '24 – Guelma',
  '25 – Constantine',
  '26 – Médéa',
  '27 – Mostaganem',
  '28 – M\'Sila',
  '29 – Mascara',
  '30 – Ouargla',
  '31 – Oran',
  '32 – El Bayadh',
  '33 – Illizi',
  '34 – Bordj Bou Arréridj',
  '35 – Boumerdès',
  '36 – El Tarf',
  '37 – Tindouf',
  '38 – Tissemsilt',
  '39 – El Oued',
  '40 – Khenchela',
  '41 – Souk Ahras',
  '42 – Tipaza',
  '43 – Mila',
  '44 – Aïn Defla',
  '45 – Naâma',
  '46 – Aïn Témouchent',
  '47 – Ghardaïa',
  '48 – Relizane',
  '49 – Timimoun',
  '50 – Bordj Badji Mokhtar',
  '51 – Ouled Djellal',
  '52 – Béni Abbès',
  '53 – In Salah',
  '54 – In Guezzam',
  '55 – Touggourt',
  '56 – Djanet',
  '57 – El M\'Ghair',
  '58 – El Meniaa',
]
