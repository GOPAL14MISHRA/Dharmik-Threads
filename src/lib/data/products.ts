import type { Product } from "@/lib/types";
import shiva from "@/assets/product-shiva.jpg";
import krishna from "@/assets/product-krishna.jpg";
import hanuman from "@/assets/product-hanuman.jpg";
import ram from "@/assets/product-ram.jpg";
import cap from "@/assets/product-cap.jpg";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import shivaWhite from "@/assets/Mahadev Trishul Oversized Tee.jpg";
import shivaBlack from "@/assets/Mahadev Trishul Oversized Tee 2.png";
import shivaOrange from "@/assets/Mahadev Trishul Oversized Tee 3.png";

const baseReview = (i: number, title: string, body: string, rating = 5): Product["reviews"][number] => ({
  id: `r${i}`,
  user: ["Aarav S.", "Priya K.", "Rohan M.", "Ananya P.", "Kabir D."][i % 5],
  rating,
  title,
  body,
  date: ["2 weeks ago", "1 month ago", "3 days ago", "5 weeks ago"][i % 4],
});

export const products: Product[] = [
  {
    id: "p1",
    slug: "mahadev-trishul-tee",
    title: "Mahadev Trishul Oversized Tee",
    description:
      "Heavyweight 240 GSM ivory cotton with a hand-illustrated saffron trishul print. Drop shoulder, boxy fit — built to outlast trends.",
    category: "tshirts",
    collection: "mahadev",
    brand: "DharmikThreads",
    variants: [
      {
        variantId: "p1-ivory",
        color: { name: "Ivory", hex: "#F8F5F0" },
        images: [shivaWhite, hero1, hanuman],
        sizes: [
          { size: "S",   price: 1499, stock: 18, sku: "MHTEE-IVY-S" },
          { size: "M",   price: 1499, stock: 22, sku: "MHTEE-IVY-M" },
          { size: "L",   price: 1499, stock: 14, sku: "MHTEE-IVY-L" },
          { size: "XL",  price: 1499, stock: 8,  sku: "MHTEE-IVY-XL" },
          { size: "XXL", price: 1599, stock: 4,  sku: "MHTEE-IVY-XXL" },
        ],
        isRealColor: true,
      },
      {
        variantId: "p1-saffron",
        color: { name: "Saffron", hex: "#FF6B00" },
        images: [shivaOrange, shiva, hero2],
        sizes: [
          { size: "S",  price: 1499, stock: 10, sku: "MHTEE-SAF-S" },
          { size: "M",  price: 1499, stock: 16, sku: "MHTEE-SAF-M" },
          { size: "L",  price: 1499, stock: 9,  sku: "MHTEE-SAF-L" },
          { size: "XL", price: 1499, stock: 5,  sku: "MHTEE-SAF-XL" },
        ],
        isRealColor: true,
      },
      {
        variantId: "p1-black",
        color: { name: "Matte Black", hex: "#111111" },
        images: [shivaBlack, shiva, hero2],
        sizes: [
          { size: "S",   price: 1499, stock: 12, sku: "MHTEE-BLK-S" },
          { size: "M",   price: 1499, stock: 8,  sku: "MHTEE-BLK-M" },
          { size: "L",   price: 1499, stock: 6,  sku: "MHTEE-BLK-L" },
          { size: "XL",  price: 1499, stock: 0,  sku: "MHTEE-BLK-XL" },
          { size: "XXL", price: 1599, stock: 2,  sku: "MHTEE-BLK-XXL" },
        ],
        isRealColor: true,
      },
    ],
    rating: 4.9,
    reviewCount: 312,
    reviews: [
      baseReview(0, "Fits like a dream", "The fabric is unreal — heavy, soft, and the print is razor sharp."),
      baseReview(1, "Premium feel", "Easily the best tee I own. Worth every rupee.", 5),
      baseReview(2, "Loved by my friends", "Got compliments the first day I wore it."),
    ],
    isBestSeller: true,
    isNew: false,
    tags: ["heavyweight", "oversized"],
    createdAt: "2026-01-15",
  },

  {
    id: "p2",
    slug: "krishna-mor-pankh-hoodie",
    title: "Krishna · Mor Pankh Hoodie",
    description:
      "Matte black 400 GSM fleece hoodie with intricate gold-foil peacock feather artwork. Lined hood, ribbed cuffs, kangaroo pocket.",
    category: "hoodies",
    collection: "krishna",
    brand: "DharmikThreads",
    variants: [
      {
        variantId: "p2-black",
        color: { name: "Matte Black", hex: "#111111" },
        images: [krishna, ram, hero1],
        sizes: [
          { size: "S",   price: 3299, stock: 10, sku: "KRHD-BLK-S" },
          { size: "M",   price: 3299, stock: 12, sku: "KRHD-BLK-M" },
          { size: "L",   price: 3299, stock: 8,  sku: "KRHD-BLK-L" },
          { size: "XL",  price: 3299, stock: 4,  sku: "KRHD-BLK-XL" },
          { size: "XXL", price: 3499, stock: 2,  sku: "KRHD-BLK-XXL" },
        ],
        isRealColor: true,
      },
      {
        variantId: "p2-charcoal",
        color: { name: "Charcoal", hex: "#1C1C1C" },
        images: [ram, krishna, hero2],
        sizes: [
          { size: "S",  price: 3299, stock: 6, sku: "KRHD-CHR-S" },
          { size: "M",  price: 3299, stock: 8, sku: "KRHD-CHR-M" },
          { size: "L",  price: 3299, stock: 5, sku: "KRHD-CHR-L" },
          { size: "XL", price: 3299, stock: 2, sku: "KRHD-CHR-XL" },
        ],
      },
    ],
    rating: 4.8,
    reviewCount: 184,
    reviews: [
      baseReview(3, "Gold foil is stunning", "Looks far more expensive than it is."),
      baseReview(0, "Warm and heavy", "Perfect for Delhi winters."),
    ],
    isBestSeller: true,
    isNew: true,
    tags: ["gold-foil", "winter"],
    createdAt: "2026-02-01",
  },

  {
    id: "p3",
    slug: "hanuman-gada-sweatshirt",
    title: "Hanuman · Gada Sweatshirt",
    description:
      "Saffron heavyweight crewneck with vertical Sanskrit mantra and Hanuman's gada in ivory. Garment-dyed, brushed inside.",
    category: "sweatshirts",
    collection: "hanuman",
    brand: "DharmikThreads",
    variants: [
      {
        variantId: "p3-saffron",
        color: { name: "Saffron", hex: "#FF6B00" },
        images: [hanuman, hero2, shiva],
        sizes: [
          { size: "S",   price: 2499, stock: 20, sku: "HNSW-SAF-S" },
          { size: "M",   price: 2499, stock: 18, sku: "HNSW-SAF-M" },
          { size: "L",   price: 2499, stock: 14, sku: "HNSW-SAF-L" },
          { size: "XL",  price: 2499, stock: 6,  sku: "HNSW-SAF-XL" },
          { size: "XXL", price: 2599, stock: 2,  sku: "HNSW-SAF-XXL" },
        ],
        isRealColor: true,
      },
      {
        variantId: "p3-ivory",
        color: { name: "Ivory", hex: "#F8F5F0" },
        images: [shiva, hanuman, hero1],
        sizes: [
          { size: "S",  price: 2499, stock: 14, sku: "HNSW-IVY-S" },
          { size: "M",  price: 2499, stock: 12, sku: "HNSW-IVY-M" },
          { size: "L",  price: 2499, stock: 8,  sku: "HNSW-IVY-L" },
          { size: "XL", price: 2499, stock: 4,  sku: "HNSW-IVY-XL" },
        ],
      },
    ],
    rating: 4.7,
    reviewCount: 96,
    reviews: [baseReview(1, "Bold and clean", "The saffron is exactly right — not too neon.")],
    isBestSeller: true,
    tags: ["garment-dyed"],
    createdAt: "2026-02-15",
  },

  {
    id: "p4",
    slug: "shri-ram-dhanush-bomber",
    title: "Shri Ram · Dhanush Bomber",
    description:
      "Tailored satin-finish bomber jacket with gold embroidery of Ram's bow and Sanskrit script along the sleeve. Quilted lining.",
    category: "jackets",
    collection: "shri-ram",
    brand: "DharmikThreads",
    variants: [
      {
        variantId: "p4-midnight",
        color: { name: "Midnight", hex: "#0A0A0F" },
        images: [ram, krishna, hero1],
        sizes: [
          { size: "S",   price: 5499, stock: 4,  sku: "RMBMB-MID-S" },
          { size: "M",   price: 5499, stock: 5,  sku: "RMBMB-MID-M" },
          { size: "L",   price: 5499, stock: 3,  sku: "RMBMB-MID-L" },
          { size: "XL",  price: 5699, stock: 2,  sku: "RMBMB-MID-XL" },
          { size: "XXL", price: 5699, stock: 0,  sku: "RMBMB-MID-XXL" },
        ],
        isRealColor: true,
      },
    ],
    rating: 5.0,
    reviewCount: 41,
    reviews: [baseReview(2, "Worth the splurge", "Construction is top-tier. Embroidery is flawless.")],
    isNew: true,
    tags: ["satin", "embroidery", "limited"],
    createdAt: "2026-03-01",
  },

  {
    id: "p5",
    slug: "durga-lotus-crewneck",
    title: "Maa Durga · Lotus Crewneck",
    description:
      "Ivory premium crewneck with hand-drawn Durga and lotus illustration in deep saffron. Soft brushed inside.",
    category: "sweatshirts",
    collection: "durga",
    brand: "DharmikThreads",
    variants: [
      {
        variantId: "p5-ivory",
        color: { name: "Ivory", hex: "#F8F5F0" },
        images: [hero2, hanuman, shiva],
        sizes: [
          { size: "S",   price: 2299, stock: 14, sku: "DGSW-IVY-S" },
          { size: "M",   price: 2299, stock: 16, sku: "DGSW-IVY-M" },
          { size: "L",   price: 2299, stock: 8,  sku: "DGSW-IVY-L" },
          { size: "XL",  price: 2299, stock: 4,  sku: "DGSW-IVY-XL" },
          { size: "XXL", price: 2399, stock: 0,  sku: "DGSW-IVY-XXL" },
        ],
        isRealColor: true,
      },
    ],
    rating: 4.9,
    reviewCount: 128,
    reviews: [baseReview(4, "So tasteful", "Respectful and beautifully designed.")],
    isBestSeller: true,
    createdAt: "2026-03-10",
  },

  {
    id: "p6",
    slug: "om-embroidered-cap",
    title: "Om Embroidered Cap",
    description:
      "Structured 6-panel cap in matte black with gold-thread Om embroidery. Adjustable strap, sweat-wicking band.",
    category: "caps",
    collection: "sanskrit",
    brand: "DharmikThreads",
    variants: [
      {
        variantId: "p6-black",
        color: { name: "Matte Black", hex: "#111111" },
        images: [cap, hero1, shiva],
        sizes: [
          { size: "One Size", price: 899, stock: 88, sku: "OMCAP-BLK-OS" },
        ],
        isRealColor: true,
      },
      {
        variantId: "p6-saffron",
        color: { name: "Saffron", hex: "#FF6B00" },
        images: [shiva, cap, hero2],
        sizes: [
          { size: "One Size", price: 949, stock: 40, sku: "OMCAP-SAF-OS" },
        ],
      },
    ],
    rating: 4.8,
    reviewCount: 210,
    reviews: [baseReview(0, "Fit is perfect", "Sits exactly right.")],
    isNew: true,
    createdAt: "2026-03-20",
  },


  {
    id: "p8",
    slug: "gita-shloka-polo",
    title: "Bhagavad Gita · Shloka Polo",
    description:
      "Heavyweight pique polo with embroidered Sanskrit shloka on the chest. Modern relaxed cut, mother-of-pearl buttons.",
    category: "polos",
    collection: "bhagavad-gita",
    brand: "DharmikThreads",
    variants: [
      {
        variantId: "p8-ivory",
        color: { name: "Ivory", hex: "#F8F5F0" },
        images: [shiva, ram, hero2],
        sizes: [
          { size: "S",   price: 1899, stock: 18, sku: "GTPLO-IVY-S" },
          { size: "M",   price: 1899, stock: 20, sku: "GTPLO-IVY-M" },
          { size: "L",   price: 1899, stock: 14, sku: "GTPLO-IVY-L" },
          { size: "XL",  price: 1899, stock: 6,  sku: "GTPLO-IVY-XL" },
          { size: "XXL", price: 1999, stock: 2,  sku: "GTPLO-IVY-XXL" },
        ],
      },
      {
        variantId: "p8-charcoal",
        color: { name: "Charcoal", hex: "#1C1C1C" },
        images: [ram, shiva, hero1],
        sizes: [
          { size: "S",   price: 1899, stock: 12, sku: "GTPLO-CHR-S" },
          { size: "M",   price: 1899, stock: 14, sku: "GTPLO-CHR-M" },
          { size: "L",   price: 1899, stock: 10, sku: "GTPLO-CHR-L" },
          { size: "XL",  price: 1899, stock: 4,  sku: "GTPLO-CHR-XL" },
        ],
      },
    ],
    rating: 4.7,
    reviewCount: 58,
    reviews: [baseReview(2, "Elevated basic", "Wear it everywhere.")],
    createdAt: "2026-04-15",
  },
];

export const collections = [
  { slug: "mahadev", name: "Mahadev", tagline: "Har Har Mahadev", image: shiva },
  { slug: "shri-ram", name: "Shri Ram", tagline: "Jai Shri Ram", image: ram },
  { slug: "krishna", name: "Krishna", tagline: "Murli Manohar", image: krishna },
  { slug: "hanuman", name: "Hanuman", tagline: "Bajrang Bali", image: hanuman },
  { slug: "bhagavad-gita", name: "Bhagavad Gita", tagline: "Karm Yog", image: shiva },
  { slug: "sanskrit", name: "Sanskrit Typography", tagline: "Sacred Script", image: cap },
] as const;

export const categories = [
  { slug: "tshirts", name: "Oversized T-Shirts" },
  { slug: "hoodies", name: "Hoodies" },
  { slug: "sweatshirts", name: "Sweatshirts" },
  { slug: "polos", name: "Polos" },
  { slug: "jackets", name: "Jackets" },
  { slug: "caps", name: "Caps" },
  { slug: "accessories", name: "Accessories" },
] as const;
