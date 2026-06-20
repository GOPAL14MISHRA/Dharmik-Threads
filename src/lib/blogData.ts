// Shared blog data — used by both the listing page and the article detail page

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  tagSlug: string;
  date: string;
  readTime: string;
  featured: boolean;
  author: string;
  imgKey: string; // key to resolve in components
  content: BlogSection[];
  relatedSlugs: string[];
}

export interface BlogSection {
  type: "heading" | "paragraph" | "quote" | "list" | "divider";
  text?: string;
  items?: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "1",
    title: "The 108 Names of Mahadev — Illustrated.",
    excerpt:
      "Shiva is not just a deity — he is the cosmos itself. We spent six months researching the 108 names of Mahadev, each one a different lens through which to understand the infinite. Here is what we found, and how it shaped our Mahadev collection.",
    tag: "Culture",
    tagSlug: "culture",
    date: "12 June 2026",
    readTime: "8 min read",
    featured: true,
    author: "Dharmik Atelier",
    imgKey: "shiva",
    relatedSlugs: ["6", "7", "8"],
    content: [
      {
        type: "paragraph",
        text: "Shiva — the destroyer, the dancer, the meditator, the householder. No deity in the Hindu pantheon contains as many contradictions as Mahadeva. He is the ascetic who renounced the world, yet married the most beautiful goddess in it. He is the god of death, yet the most merciful of all. He is stillness and chaos, simultaneously.",
      },
      {
        type: "heading",
        text: "The Research",
      },
      {
        type: "paragraph",
        text: "When we began the Mahadev collection, we knew we could not approach it casually. Our creative director spent three months in Varanasi — the city of Shiva — studying the Shiva Sahasranama, the thousand names of Lord Shiva found in the Mahabharata. We distilled these into 108 names, each one a unique attribute.",
      },
      {
        type: "quote",
        text: "\"Every name of Shiva is a different door into the same infinite room. You don't need to open all of them — just one is enough to change you.\" — Pandit Rajan Mishra, Varanasi",
      },
      {
        type: "heading",
        text: "108: The Sacred Number",
      },
      {
        type: "paragraph",
        text: "Why 108? The number appears throughout Vedic tradition. There are 108 Upanishads. The distance between the Earth and the Sun is approximately 108 times the Sun's diameter. A mala — the prayer beads used in japa meditation — has 108 beads. The number is a cosmic constant.",
      },
      {
        type: "list",
        items: [
          "Mahakala — The Great Time, the one who transcends time itself",
          "Mrityunjaya — The conqueror of death",
          "Nataraja — The lord of the cosmic dance",
          "Pashupati — The lord of all living beings",
          "Bholenath — The innocent one, easily pleased by devotion",
          "Rudra — The howler, the storm god, the fierce one",
          "Vishwanath — The lord of the universe",
        ],
      },
      {
        type: "heading",
        text: "From Research to Cloth",
      },
      {
        type: "paragraph",
        text: "The Mahadev Trishul Tee began as a single sketch: Shiva's trishula — the trident — rendered in the style of a yantra. A geometric abstraction of the weapon that separates creation, preservation, and destruction. The three prongs are not just a weapon; they are a philosophy.",
      },
      {
        type: "paragraph",
        text: "We printed on 240 GSM ivory cotton because ivory is the colour of ash — the vibhuti that Shiva smears on his body as a reminder that all things return to dust. The saffron of the print is the colour of tapas, of fire, of devotion that burns away all impurity.",
      },
      {
        type: "quote",
        text: "\"Every garment we make is a prayer in cloth form. If it does not begin with research and end with reverence, we do not make it.\"",
      },
      {
        type: "heading",
        text: "Wear It as Practice",
      },
      {
        type: "paragraph",
        text: "Dharmik clothing is not costume. When you wear the Mahadev Tee, we want you to carry the weight of those 108 names with you — not as a burden, but as a reminder. Har Har Mahadev.",
      },
    ],
  },
  {
    slug: "2",
    title: "Why We Still Print in Small Batches.",
    excerpt:
      "In an era of fast fashion and mass production, we deliberately chose the harder path. Every Dharmik drop is limited — not as a marketing gimmick, but as a spiritual discipline.",
    tag: "Craft",
    tagSlug: "craft",
    date: "28 May 2026",
    readTime: "5 min read",
    featured: false,
    author: "Vikram Nair",
    imgKey: "krishna",
    relatedSlugs: ["3", "5", "1"],
    content: [
      {
        type: "paragraph",
        text: "When we launched Dharmik in 2024, we had a choice: scale fast or scale right. We had offers from two large manufacturers in Tirupur who could produce 10,000 units a month. We said no.",
      },
      {
        type: "heading",
        text: "The Philosophy of Limitation",
      },
      {
        type: "paragraph",
        text: "In Vedic philosophy, sanyam — self-restraint — is considered a virtue. The yogi who can control what he produces controls what he values. We apply this to manufacturing. Every batch of 200 garments is treated as a single work of art.",
      },
      {
        type: "quote",
        text: "\"Scarcity is not a strategy. It is a consequence of caring deeply about what you make.\"",
      },
      {
        type: "heading",
        text: "What Small Batch Actually Means",
      },
      {
        type: "list",
        items: [
          "Every garment is hand-inspected before shipping",
          "Print plates are reset between each run to maintain sharpness",
          "Fabric is sourced from a single mill in Coimbatore per batch",
          "Our QC team rejects roughly 12% of every production run",
          "Each piece ships with a hand-stamped card noting the batch number",
        ],
      },
      {
        type: "heading",
        text: "The Math That Makes It Work",
      },
      {
        type: "paragraph",
        text: "We sell fewer units at a higher margin. We have no inventory sitting in warehouses. We have no end-of-season sales. Every piece we make is accounted for before production begins. This is not a luxury brand playbook — it is common sense applied with discipline.",
      },
      {
        type: "paragraph",
        text: "When a Dharmik tee sells out, it is gone. We may bring back the design in a future drop — but it will be a new batch, with small refinements. Nothing stays exactly the same. Like life itself.",
      },
    ],
  },
  {
    slug: "3",
    title: "Inside the Dyers of Tirupur.",
    excerpt:
      "We travelled to Tamil Nadu's textile capital to meet the artisans who hand-dye every Dharmik garment in sacred saffron, deep ivory, and midnight black.",
    tag: "Process",
    tagSlug: "process",
    date: "10 May 2026",
    readTime: "6 min read",
    featured: false,
    author: "Meera Iyer",
    imgKey: "hero2",
    relatedSlugs: ["2", "4", "5"],
    content: [
      {
        type: "paragraph",
        text: "Tirupur smells of cotton and chemicals and ambition. It is a city of four million people who have collectively decided that cloth is the most important thing in the world. They are probably right.",
      },
      {
        type: "heading",
        text: "Finding the Right Hands",
      },
      {
        type: "paragraph",
        text: "We visited eleven dyeing units before we found Murugan Textiles. Run by brothers Murugan and Selvam, the unit specialises in what they call 'heritage shades' — colours derived from natural dye formulas passed down through their family for three generations.",
      },
      {
        type: "quote",
        text: "\"Saffron is the hardest colour to get right. It sits between orange and yellow — and the exact shade depends on the time of year, the water, even the mood of the vat.\" — Murugan, Master Dyer",
      },
      {
        type: "heading",
        text: "The Three Dharmik Colours",
      },
      {
        type: "list",
        items: [
          "Saffron (Kesari): Made from a base of reactive orange, cooled slowly to produce the sacred hue used in temple flags",
          "Ivory (Hathi Dant): Not white — a warm, slightly warm off-white achieved by under-dyeing with a touch of natural turmeric",
          "Midnight Black (Kali Raat): A deep, cold black achieved through triple-dyeing in reactive dye baths",
        ],
      },
      {
        type: "heading",
        text: "Why It Matters",
      },
      {
        type: "paragraph",
        text: "You can buy a saffron t-shirt from any streetwear brand. But when the colour is produced thoughtlessly, it shows — it fades unevenly, it looks brash rather than sacred. The difference between a carelessly dyed saffron and ours is the difference between a shouted prayer and a whispered one.",
      },
      {
        type: "paragraph",
        text: "We visit Tirupur twice a year. Murugan's team now knows our shades by heart. They have named them: 'Mahadev Saffron', 'Temple Ivory', 'Kali Black'. We consider that the highest compliment.",
      },
    ],
  },
  {
    slug: "4",
    title: "Shikhara: The Architecture of Ascent.",
    excerpt:
      "A North Indian temple shikhara is not just a rooftop — it is a vertical mantra in stone. We decode the sacred geometry that inspired our wall art collection.",
    tag: "Heritage",
    tagSlug: "heritage",
    date: "21 April 2026",
    readTime: "7 min read",
    featured: false,
    author: "Dharmik Atelier",
    imgKey: "poster",
    relatedSlugs: ["7", "1", "8"],
    content: [
      {
        type: "paragraph",
        text: "Stand at the base of a Nagara-style temple and look up. The shikhara rises in perfect, recursive symmetry — each level a smaller repetition of the one below, converging at a single point that seems to pierce the sky. This is not architecture. This is geometry as theology.",
      },
      {
        type: "heading",
        text: "The Mathematics of the Sacred",
      },
      {
        type: "paragraph",
        text: "The Vastu Shastra — the ancient Indian science of architecture — specifies precise ratios for every element of a temple. The shikhara's height is typically 1.5 to 3 times the height of the sanctum below it. Its taper follows a curve called the Latin amalaka — named for the gooseberry fruit whose shape it mimics.",
      },
      {
        type: "quote",
        text: "\"The temple is a mountain made by human hands. The shikhara is its summit — the point where earth meets sky, where the human reaches for the divine.\"",
      },
      {
        type: "heading",
        text: "Regional Variations",
      },
      {
        type: "list",
        items: [
          "Nagara style (North India): Tall, curvilinear shikhara; found at Khajuraho and Konark",
          "Dravida style (South India): Stepped pyramid gopuram; found at Madurai and Thanjavur",
          "Vesara style (Deccan): A hybrid combining elements of both",
          "Kalinga style (Odisha): Distinctive rekha deul with vertical lines carved into the tower",
        ],
      },
      {
        type: "heading",
        text: "From Stone to Paper",
      },
      {
        type: "paragraph",
        text: "Our Shikhara Wall Art series began as a sketch by our illustrator Anand during a visit to the Kandariya Mahadeva temple at Khajuraho. He spent two days drawing the same shikhara from different angles before he found the one that captured what he was looking for.",
      },
      {
        type: "paragraph",
        text: "The final print is a hand-illustrated elevation of a composite Nagara shikhara — not copied from any one temple, but assembled from the proportions of several. It is printed on 250 GSM matte cotton paper in a saffron-to-gold gradient that evokes the last light of day hitting carved sandstone.",
      },
    ],
  },
  {
    slug: "5",
    title: "How to Style Oversized Tees the Dharmik Way.",
    excerpt:
      "Our oversized silhouettes are built for layering, movement, and meaning. Here are five looks our community has created — each one a different expression of the same sacred spirit.",
    tag: "Style",
    tagSlug: "style",
    date: "5 April 2026",
    readTime: "4 min read",
    featured: false,
    author: "Community",
    imgKey: "hero1",
    relatedSlugs: ["2", "3", "6"],
    content: [
      {
        type: "paragraph",
        text: "The Dharmik tee is not designed to be worn in one way. It is designed to be worn in your way — whatever that means for your body, your life, your sense of the sacred. Here are five looks from our community that we love.",
      },
      {
        type: "heading",
        text: "Look 1: The Minimalist",
      },
      {
        type: "paragraph",
        text: "Aarav from Delhi wears the Mahadev Tee tucked loosely into straight-cut cream trousers with white leather sneakers. 'I wear it like a uniform,' he says. 'Every day. It reminds me who I am before I go out into the world.'",
      },
      {
        type: "heading",
        text: "Look 2: The Traditionalist",
      },
      {
        type: "paragraph",
        text: "Priya from Varanasi layers the Hanuman Sweatshirt over a white kurta on cold mornings. The orange of the sweatshirt with the white of the kurta creates a combination that she says 'looks like a sunrise over the Ganga'.",
      },
      {
        type: "quote",
        text: "\"I don't think of it as streetwear. I think of it as devotional clothing that happens to be comfortable.\" — Kabir, Jaipur",
      },
      {
        type: "heading",
        text: "Look 3: The Layers",
      },
      {
        type: "paragraph",
        text: "The Shri Ram Bomber worn open over the Mahadev Tee — this combination keeps appearing in our community submissions. There is something about the interplay of the two collections, the bow and the trident, that people find resonant.",
      },
      {
        type: "heading",
        text: "The One Rule",
      },
      {
        type: "list",
        items: [
          "Wear it with intention — know what you're wearing and why",
          "Don't over-accessorise — let the print breathe",
          "Comfort is not a compromise — it is the point",
          "Mix with traditional pieces fearlessly — kurtas, dhotis, jutis all work",
        ],
      },
    ],
  },
  {
    slug: "6",
    title: "The Hanuman Principle: Strength Through Devotion.",
    excerpt:
      "Hanuman's gada is not just a weapon — it is a symbol of discipline turned into devotion. We explore how the Bajrang Bali's philosophy shaped our Hanuman collection.",
    tag: "Culture",
    tagSlug: "culture",
    date: "20 March 2026",
    readTime: "6 min read",
    featured: false,
    author: "Arjun Sharma",
    imgKey: "hanuman",
    relatedSlugs: ["1", "7", "8"],
    content: [
      {
        type: "paragraph",
        text: "In the Ramayana, Hanuman crosses an ocean in a single leap. He carries a mountain on his palm. He sets Lanka on fire with his own tail. He is the most physically capable being in the text — and yet he never uses his power for himself. Every act of strength is an act of service.",
      },
      {
        type: "heading",
        text: "The Paradox of the Perfect Devotee",
      },
      {
        type: "paragraph",
        text: "Hanuman is both the most powerful and the most humble character in Hindu mythology. This is not a contradiction. It is the point. Real strength — the Hanuman Principle — is strength that has been sublimated into devotion.",
      },
      {
        type: "quote",
        text: "\"Hanuman does not fight for glory. He fights for Ram. That selflessness is the most radical act possible in a world that rewards ego.\"",
      },
      {
        type: "heading",
        text: "The Gada: Weapon as Symbol",
      },
      {
        type: "paragraph",
        text: "The gada — the mace — is Hanuman's weapon. But it is also a symbol. The circular head represents the ego, which has been placed at the bottom of a shaft — controlled, directed, disciplined. The warrior who wields a gada masters their own mind before they face any external enemy.",
      },
      {
        type: "list",
        items: [
          "Strength without ego: Hanuman never boasts of his feats",
          "Action without attachment: he completes the mission and asks for nothing",
          "Devotion as discipline: his bhakti is not passive — it is the most active force in the text",
          "Service as purpose: his identity is defined entirely by what he does for others",
        ],
      },
      {
        type: "heading",
        text: "In the Fabric",
      },
      {
        type: "paragraph",
        text: "The Hanuman Gada Sweatshirt is saffron — the colour of the sun, of fire, of tapas. The gada is rendered in ivory against the saffron ground, with a vertical Sanskrit mantra running along the side seam. Jai Bajrang Bali.",
      },
    ],
  },
  {
    slug: "7",
    title: "Shri Ram: The Ideal of the Perfect Human.",
    excerpt:
      "Maryada Purushottam — the highest among men. We delve into the principles of Shri Ram that inspired our Dhanush Bomber jacket, from dharma to loyalty.",
    tag: "Heritage",
    tagSlug: "heritage",
    date: "25 February 2026",
    readTime: "9 min read",
    featured: false,
    author: "Dharmik Atelier",
    imgKey: "ram",
    relatedSlugs: ["6", "1", "4"],
    content: [
      {
        type: "paragraph",
        text: "Ram is called Maryada Purushottam — the ideal man, the one who upholds the limits of righteous conduct. He is not the most powerful being in the Ramayana; that is Hanuman. He is not the wisest; that is perhaps Vibhishana. He is the most dharmic. And in the Vedic worldview, that is the highest possible quality.",
      },
      {
        type: "heading",
        text: "What Dharma Actually Means",
      },
      {
        type: "paragraph",
        text: "Dharma is often translated as 'righteousness' or 'duty', but these translations flatten something dimensional. Dharma is closer to 'the right way of being in the world' — specific to your nature, your role, your moment in time. Ram's dharma as a king differed from his dharma as a husband, which differed from his dharma as a son.",
      },
      {
        type: "quote",
        text: "\"Ram's exile was not a punishment. It was a demonstration. He showed that dharma is more important than comfort, more important than power, more important than happiness.\"",
      },
      {
        type: "heading",
        text: "The Fourteen Qualities of Ram",
      },
      {
        type: "list",
        items: [
          "Guni (virtuous) — possessing all virtues",
          "Viryavan (courageous) — brave without aggression",
          "Dharmajnya (knower of dharma) — understanding right action",
          "Kritajnya (grateful) — remembering every kindness",
          "Satyavakya (truthful) — never speaking falsely",
          "Dridhavrata (steadfast) — unwavering in commitment",
          "Priyodarshan (pleasant in appearance) — graceful and dignified",
          "Atmaavan (self-controlled) — master of his own impulses",
        ],
      },
      {
        type: "heading",
        text: "The Dhanush Bomber",
      },
      {
        type: "paragraph",
        text: "Ram's bow — the Kodanda — is his symbol. It represents dharma itself: when properly strung, it is the most powerful force in existence. When unstrung, it is useless. The gold embroidery on the Dhanush Bomber traces the arc of the Kodanda across the back panel, with the inscription 'Jai Shri Ram' in Devanagari along the left sleeve.",
      },
      {
        type: "paragraph",
        text: "The bomber is tailored in midnight satin — a fabric that catches light the way a polished dhanush would, revealing its form only in motion. Wear it. Move in it. Let it remind you who you are trying to be.",
      },
    ],
  },
  {
    slug: "8",
    title: "Om: The Sound That Shaped a Universe.",
    excerpt:
      "The Om symbol on our embroidered caps is more than a logo. It is the primordial vibration — the sound of creation itself. Here is its story.",
    tag: "Culture",
    tagSlug: "culture",
    date: "10 February 2026",
    readTime: "5 min read",
    featured: false,
    author: "Riya Gupta",
    imgKey: "cap",
    relatedSlugs: ["1", "4", "6"],
    content: [
      {
        type: "paragraph",
        text: "Before there was light, there was sound. The Mandukya Upanishad opens with a declaration: 'Om — this entire world is Om.' Not a symbol, not a syllable, but the very fabric of existence rendered in vibration.",
      },
      {
        type: "heading",
        text: "The Three Sounds Inside Om",
      },
      {
        type: "paragraph",
        text: "Om is written as a single symbol but contains three sounds: A, U, and M. In Sanskrit, 'A' and 'U' combine to form 'O'. Each sound corresponds to a state of consciousness.",
      },
      {
        type: "list",
        items: [
          "'A' — the waking state (Jagrat): the world of everyday experience",
          "'U' — the dreaming state (Svapna): the world of the unconscious mind",
          "'M' — the deep sleep state (Sushupti): the world beyond dreams",
          "The silence after 'M' — the fourth state (Turiya): pure consciousness itself",
        ],
      },
      {
        type: "quote",
        text: "\"Om is not something you say. It is something you remember. When you chant Om, you are not creating a sound — you are recognising one that was always there.\" — Swami Vivekananda",
      },
      {
        type: "heading",
        text: "The Symbol's Anatomy",
      },
      {
        type: "paragraph",
        text: "The Om symbol (ॐ) has three curves, a semi-circle, and a dot. The lower curve is the waking state. The upper curve is the unconscious. The trailing curve on the right is the dreaming mind. The semi-circle separates the three lower states from the dot — which represents Turiya, the transcendent fourth state, separate from and yet encompassing all the others.",
      },
      {
        type: "heading",
        text: "On Our Caps",
      },
      {
        type: "paragraph",
        text: "The Om on our embroidered caps is sewn in gold thread on a matte black panel. We chose gold because it is the colour of the sun, of illumination, of knowledge. The black ground represents the infinite — the space into which all sound eventually resolves. Wear it. And remember.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  return post.relatedSlugs
    .map((s) => BLOG_POSTS.find((p) => p.slug === s))
    .filter(Boolean) as BlogPost[];
}
