import { useState } from "react";

// ─── GOOGLE FONTS (kept as the Amour Estilo standard pairing) ────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');`;

// ─── RESPONSIVE / SHARED STYLES ───────────────────────────────────────────────
const STYLES = `
  * { box-sizing: border-box; }
  .ae-root { font-family: 'DM Sans', sans-serif; }

  .ae-topbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 60px; background: #0A0A0A; }
  .ae-look-indicator { display: flex; align-items: center; gap: 6px; }

  .ae-main { display: flex; max-width: 1280px; margin: 0 auto; min-height: calc(100vh - 60px); align-items: flex-start; }
  .ae-side-left { width: 220px; flex-shrink: 0; padding: 28px 0 28px 24px; border-right: 0.5px solid #EBEBEB; display: flex; flex-direction: column; }
  .ae-content { flex: 1; min-width: 0; padding: 28px 28px 60px; }
  .ae-side-right { width: 260px; flex-shrink: 0; border-left: 0.5px solid #EBEBEB; padding: 28px 20px; background: #0A0A0A; position: sticky; top: 60px; align-self: flex-start; height: calc(100vh - 60px); }

  .ae-mobile-tabs { display: none; }
  .ae-mobile-bar { display: none; }

  .ae-brand-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0 28px; }

  @media (max-width: 1024px) {
    .ae-side-left, .ae-side-right { display: none; }
    .ae-content { padding: 18px 16px 96px; }
    .ae-mobile-tabs { display: flex; gap: 0; overflow-x: auto; border-bottom: 1px solid #EBEBEB; margin-bottom: 24px; -webkit-overflow-scrolling: touch; }
    .ae-mobile-tabs::-webkit-scrollbar { display: none; }
    .ae-mobile-bar { display: flex; }
    .ae-look-indicator { display: none; }
  }

  @media (max-width: 640px) {
    .ae-brand-grid { grid-template-columns: 1fr; }
    .ae-topbar { padding-left: 16px !important; padding-right: 16px !important; }
  }

  .ae-brand-row { display: flex; gap: 14px; align-items: flex-start; padding: 14px 2px; border: none; border-bottom: 0.5px solid #ECECEC; cursor: pointer; background: none; width: 100%; text-align: left; transition: background .15s ease; }
  .ae-brand-row:last-child { border-bottom: none; }
  .ae-brand-row:hover { background: #FAFAF8; }
  .ae-list-row { padding: 14px 2px; border-bottom: 0.5px solid #ECECEC; }
  .ae-list-row:last-child { border-bottom: none; }
  .ae-radio { width: 15px; height: 15px; border-radius: 50%; border: 1px solid #D6D6D6; flex-shrink: 0; margin-top: 4px; display: flex; align-items: center; justify-content: center; transition: border-color .15s ease; }
  .ae-radio-dot { width: 6px; height: 6px; border-radius: 50%; background: #C8A96E; }
  .ae-divider { width: 22px; height: 1px; background: #E2DED7; margin: 1px 0 3px; }
  .ae-logo { line-height: 1.25; }
  .ae-brand-name { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 400; line-height: 1.35; }
  .ae-tag { font-size: 9px; letter-spacing: 1.2px; text-transform: uppercase; font-family: 'DM Sans', sans-serif; display: block; }
  .ae-brand-note { font-size: 11px; font-style: italic; line-height: 1.5; font-family: 'Cormorant Garamond', Georgia, serif; }

  .ae-row { display: flex; gap: 20px; margin-bottom: 36px; padding-bottom: 32px; border-bottom: 0.5px solid #EFEFEF; }
  .ae-row:last-child { border-bottom: none; }
  .ae-row-num { flex-shrink: 0; width: 44px; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 38px; font-weight: 300; color: #E6E1D8; line-height: 1; }
  @media (max-width: 640px) {
    .ae-row { gap: 10px; }
    .ae-row-num { width: 32px; font-size: 28px; }
  }

  .ae-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 2px; background: #2A2A2A; border-radius: 2px; outline: none; }
  .ae-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #C8A96E; cursor: pointer; border: none; }
  .ae-slider::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: #C8A96E; cursor: pointer; border: none; }

  .ae-slider-light { -webkit-appearance: none; appearance: none; width: 100%; height: 2px; background: #E0E0E0; border-radius: 2px; outline: none; }
  .ae-slider-light::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #0A0A0A; cursor: pointer; border: none; }
  .ae-slider-light::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: #0A0A0A; cursor: pointer; border: none; }
`;

// ─── LOOK PROFILES (Artist curated) ──────────────────────────────────────────
const LOOKS = [
  {
    id: "editorial",
    name: "Editorial Noir",
    tagline: "Sculptural. Severe. Runway-ready.",
    mood: "High contrast. Graphic liner. Velvet skin.",
    palette: ["#1A1A1A", "#2C2C2C", "#8B0000"],
    artist_note: "My go-to for shoots and gala evenings. Every product here earns its place — nothing decorative.",
  },
  {
    id: "parisian",
    name: "Parisian Lumière",
    tagline: "Effortless. Dewy. Understated luxury.",
    mood: "Barely-there base. Flushed cheeks. Naked lip.",
    palette: ["#D4B8A0", "#C9967A", "#F0E6DC"],
    artist_note: "The hardest look to get right — it should look like you're not wearing makeup but your skin is just that good.",
  },
  {
    id: "bombay",
    name: "Bombay Dusk",
    tagline: "Warm. Gilded. Festive-precise.",
    mood: "Golden hour skin. Kohl depth. Rich lip.",
    palette: ["#C8860A", "#8B4513", "#D4AF37"],
    artist_note: "Built for Indian light — artificial and natural both. Pigments that read across a room.",
  },
  {
    id: "no_filter",
    name: "No-Filter Skin",
    tagline: "Skin-first. Clean. Modern.",
    mood: "Skincare-led base. Soft brows. Glassy finish.",
    palette: ["#E8D5C4", "#C4A882", "#F5F0EB"],
    artist_note: "Less is architecture here. Every step in prep pays for itself tenfold.",
  },
  {
    id: "global",
    name: "Seoul Glass",
    tagline: "Translucent. Luminous. Internationally fluent.",
    mood: "Glass-skin layering. Gradient lips. Soft, undone brows.",
    palette: ["#F7C6C7", "#FCE8E6", "#D98C8C"],
    artist_note: "Skin so clear it looks lit from within — K-beauty technique, finished for any city, any light.",
  },
];

// ─── CATALOG with artist suggestions per look ─────────────────────────────────
const CATALOG = [
  {
    step: 1,
    category: "Skin Prep",
    slug: "prep",
    icon: "○",
    subtitle: "The foundation of everything",
    items: [
      {
        id: "wet_tissue", name: "Cleansing Tissue", type: "Cleanse",
        brands: [
          { name: "Bioderma", mrp: 620, looks: ["parisian", "no_filter"], note: "Dermatologist-grade. Zero irritation." },
          { name: "Simple", mrp: 350, looks: ["no_filter", "bombay"], note: "Fragrance-free. Daily use." },
          { name: "Neutrogena", mrp: 480, looks: ["editorial", "bombay"], note: "Deep clean before heavy coverage." },
          { name: "Then I Met You Living Cleansing Balm", mrp: 1800, looks: ["global", "parisian"], note: "Slow-beauty double-cleanse opener.", popular: true },
        ],
      },
      {
        id: "micellar", name: "Micellar Water", type: "Cleanse",
        brands: [
          { name: "Bioderma Sensibio H2O", mrp: 1200, looks: ["parisian", "no_filter", "editorial"], note: "The original. Cult since 1995." },
          { name: "La Roche-Posay Effaclar", mrp: 1450, looks: ["editorial", "no_filter"], note: "For oily-combination skin types." },
          { name: "Garnier Micellar", mrp: 499, looks: ["bombay"], note: "Accessible daily cleanser." },
          { name: "innisfree Green Tea Cleansing Water", mrp: 950, looks: ["global", "no_filter"], note: "K-beauty bestseller. Calms while it cleans.", popular: true },
        ],
      },
      {
        id: "scrub", name: "Face Scrub", type: "Exfoliate",
        brands: [
          { name: "PAC Lemon Squash", mrp: 695, looks: ["bombay", "parisian"], note: "Brightening. Preps for luminous base." },
          { name: "Kiehl's Rare Earth", mrp: 2400, looks: ["editorial", "no_filter"], note: "Deep-pore refinement." },
          { name: "St. Ives Apricot", mrp: 399, looks: ["bombay"], note: "Classic physical exfoliant." },
          { name: "Tatcha The Rice Polish", mrp: 3200, looks: ["global", "parisian"], note: "Cult Japanese-rice enzyme finish.", popular: true },
        ],
      },
      {
        id: "toner", name: "Toner", type: "Tone",
        brands: [
          { name: "Forest Essentials Tejal Water", mrp: 1250, looks: ["bombay", "parisian"], note: "Rose + saffron. Glow-inducing." },
          { name: "DALBA Vita C Serum Toner", mrp: 2800, looks: ["no_filter", "parisian"], note: "Korean actives. Radiance focus." },
          { name: "Love Earth Rose Toner", mrp: 549, looks: ["no_filter", "bombay"], note: "Gentle pH balance." },
          { name: "Laneige Cream Skin Refiner", mrp: 2600, looks: ["global", "no_filter"], note: "The glass-skin layering starter.", popular: true },
        ],
      },
      {
        id: "moisturiser", name: "Moisturiser", type: "Hydrate",
        brands: [
          { name: "Embryolisse Lait-Crème", mrp: 1800, looks: ["parisian", "editorial"], note: "Backstage staple. Primer base hybrid." },
          { name: "Bobbi Brown Intensive Skin", mrp: 4200, looks: ["editorial", "no_filter"], note: "Weightless. Stays all day." },
          { name: "Flicka Barrier Cream", mrp: 850, looks: ["no_filter", "bombay"], note: "Indian skin-friendly formula." },
          { name: "Laneige Water Bank Cream", mrp: 3400, looks: ["global", "no_filter"], note: "The most-searched hydration cream worldwide.", popular: true },
        ],
      },
    ],
  },
  {
    step: 2,
    category: "Base Makeup",
    slug: "base",
    icon: "◻",
    subtitle: "Your second skin",
    items: [
      {
        id: "primer", name: "Primer", type: "Base",
        brands: [
          { name: "M·A·C Prep + Prime", mrp: 2750, looks: ["editorial", "bombay"], note: "Longwear lock. 8-hour hold." },
          { name: "Smashbox Photo Finish", mrp: 3200, looks: ["parisian", "editorial"], note: "The photographer's choice." },
          { name: "e.l.f. Poreless Putty", mrp: 899, looks: ["no_filter", "bombay"], note: "Blurs and smooths." },
          { name: "Milk Makeup Hydro Grip", mrp: 2600, looks: ["global", "no_filter"], note: "Internet-famous grip + glow primer.", popular: true },
        ],
      },
      {
        id: "foundation", name: "Foundation", type: "Base",
        brands: [
          { name: "Estée Lauder Double Wear", mrp: 4600, looks: ["editorial", "bombay"], note: "24hr. Transfers to nothing." },
          { name: "NARS Natural Radiant Longwear", mrp: 5200, looks: ["parisian", "no_filter"], note: "Luminous skin finish." },
          { name: "M·A·C Studio Fix Fluid", mrp: 3400, looks: ["editorial", "bombay"], note: "Full coverage. Matte." },
          { name: "Fenty Beauty Pro Filt'r Soft Matte", mrp: 3800, looks: ["editorial", "global"], note: "50-shade range. The shade-match benchmark.", popular: true },
        ],
      },
      {
        id: "concealer", name: "Concealer", type: "Cover",
        brands: [
          { name: "Too Faced Born This Way", mrp: 2800, looks: ["parisian", "no_filter"], note: "Natural finish. Buildable." },
          { name: "Tarte Shape Tape", mrp: 2600, looks: ["editorial", "bombay"], note: "Full-coverage. Under-eye precision." },
          { name: "L.A. Girl Pro Conceal", mrp: 699, looks: ["bombay", "no_filter"], note: "High pigment. Artist favorite." },
          { name: "Rare Beauty Liquid Touch", mrp: 2400, looks: ["no_filter", "global"], note: "Skin-like, weightless coverage.", popular: true },
        ],
      },
      {
        id: "powder", name: "Setting Powder", type: "Set",
        brands: [
          { name: "Laura Mercier Translucent", mrp: 4800, looks: ["parisian", "no_filter", "editorial"], note: "The industry standard." },
          { name: "M·A·C Mineralize Skinfinish", mrp: 2950, looks: ["bombay", "editorial"], note: "Natural. Adds dimension." },
          { name: "M·A·C Compact Powder", mrp: 2200, looks: ["bombay"], note: "Travel-ready. Reliable." },
          { name: "Huda Beauty Easy Bake Powder", mrp: 3100, looks: ["bombay", "editorial"], note: "Colour-correcting bake-and-set.", popular: true },
        ],
      },
    ],
  },
  {
    step: 3,
    category: "Eye Artistry",
    slug: "eyes",
    icon: "◇",
    subtitle: "Where the story is told",
    items: [
      {
        id: "eyeshadow", name: "Eyeshadow Palette", type: "Colour",
        brands: [
          { name: "Urban Decay Naked", mrp: 5500, looks: ["parisian", "no_filter", "editorial"], note: "Neutral authority. Warmth range." },
          { name: "Huda Beauty Rose Gold", mrp: 6800, looks: ["bombay", "editorial"], note: "Foils + mattes. Maximum drama." },
          { name: "M·A·C Eyeshadow × 9", mrp: 4200, looks: ["editorial", "bombay"], note: "Pro formula. Intense pigment." },
          { name: "Pat McGrath Labs Mothership", mrp: 7200, looks: ["editorial", "bombay"], note: "The most-coveted palette on every artist's kit list.", popular: true },
        ],
      },
      {
        id: "kajal", name: "Kajal Pencil", type: "Define",
        brands: [
          { name: "M·A·C Eye Kohl", mrp: 1650, looks: ["editorial", "bombay"], note: "Smudge-fast. Intense black." },
          { name: "Maybelline Colossal Kajal", mrp: 299, looks: ["bombay", "no_filter"], note: "24hr. Accessible." },
          { name: "Kiko Milano Kajal", mrp: 950, looks: ["parisian", "editorial"], note: "Italian precision. Soft finish." },
          { name: "Lakmé Eyeconic Kajal", mrp: 375, looks: ["bombay", "no_filter"], note: "India's best-selling kajal, year after year.", popular: true },
        ],
      },
      {
        id: "eyeliner", name: "Eyeliner", type: "Define",
        brands: [
          { name: "M·A·C Fluidline", mrp: 1850, looks: ["editorial", "bombay"], note: "Gel formula. Stays put." },
          { name: "Urban Decay 24/7 Glide-On", mrp: 2200, looks: ["editorial", "parisian"], note: "Precision. 24hr waterproof." },
          { name: "NYX Epic Ink", mrp: 750, looks: ["no_filter", "bombay"], note: "Brush-tip. Clean wing." },
          { name: "rom&nd Clear Layer Liner", mrp: 650, looks: ["global", "no_filter"], note: "K-beauty's fine-tip everyday liner.", popular: true },
        ],
      },
      {
        id: "mascara", name: "Mascara", type: "Lashes",
        brands: [
          { name: "Too Faced Better Than Sex", mrp: 2900, looks: ["editorial", "bombay", "parisian"], note: "Volume + length. The benchmark." },
          { name: "Charlotte Tilbury Pillow Talk", mrp: 3200, looks: ["parisian", "no_filter"], note: "Multiplying. Feathered effect." },
          { name: "M·A·C In Extreme Dimension", mrp: 2400, looks: ["editorial", "bombay"], note: "Maximum drama." },
          { name: "Maybelline Lash Sensational Sky High", mrp: 950, looks: ["bombay", "no_filter", "global"], note: "Searched more than any other mascara.", popular: true },
        ],
      },
      {
        id: "lashes", name: "False Lashes", type: "Lashes",
        brands: [
          { name: "House of Lashes Iconic", mrp: 1400, looks: ["editorial", "bombay"], note: "Wearable drama. Reusable." },
          { name: "Huda Beauty Classic", mrp: 2200, looks: ["bombay", "editorial"], note: "Full glam. Photographer-ready." },
          { name: "Ardell Wispies", mrp: 850, looks: ["parisian", "no_filter"], note: "Natural flutter. First-lash friendly." },
          { name: "Velour Lashes Effortless", mrp: 1900, looks: ["parisian", "global"], note: "Featherweight, second-skin lash.", popular: true },
        ],
      },
      {
        id: "lenses", name: "Eye Lenses", type: "Colour",
        brands: [
          { name: "Solotica Hidrocor", mrp: 4800, looks: ["editorial", "bombay"], note: "Brazilian. Transformative colour." },
          { name: "Air Optix Colors", mrp: 2400, looks: ["parisian", "no_filter"], note: "Comfort wear. Subtle shift." },
          { name: "Freshlook Colorblends", mrp: 1200, looks: ["bombay", "no_filter"], note: "Accessible enhancement." },
          { name: "Bausch + Lomb Lacelle", mrp: 1800, looks: ["no_filter", "global"], note: "Soft gradient tone, barely-there shift.", popular: true },
        ],
      },
    ],
  },
  {
    step: 4,
    category: "Cheeks & Glow",
    slug: "cheeks",
    icon: "△",
    subtitle: "Dimension and radiance",
    items: [
      {
        id: "blush", name: "Blush", type: "Colour",
        brands: [
          { name: "Rare Beauty Soft Pinch Liquid", mrp: 2950, looks: ["parisian", "no_filter"], note: "Blurs into skin. Effortless flush." },
          { name: "Huda Beauty Blush Palette", mrp: 5200, looks: ["editorial", "bombay"], note: "Six coordinated shades." },
          { name: "M·A·C Powder Blush", mrp: 2400, looks: ["editorial", "bombay", "parisian"], note: "Pro standard. Buildable." },
          { name: "o2o Mineral Blush", mrp: 699, looks: ["no_filter", "bombay"], note: "Clean mineral formula." },
          { name: "Fenty Beauty Cheeks Out Cream Blush", mrp: 2700, looks: ["editorial", "global"], note: "The 'no-makeup flush' everyone's searching for.", popular: true },
        ],
      },
      {
        id: "highlighter", name: "Highlighter", type: "Glow",
        brands: [
          { name: "Rare Beauty Positive Light", mrp: 2800, looks: ["no_filter", "parisian"], note: "Liquid. Lit-from-within effect." },
          { name: "M·A·C Mineralize Skinfinish", mrp: 3200, looks: ["editorial", "bombay"], note: "Dimensional strobe." },
          { name: "Kay Beauty Highlighter", mrp: 899, looks: ["bombay", "no_filter"], note: "Indian skin tone optimised." },
          { name: "Fenty Beauty Killawatt Freestyle", mrp: 3100, looks: ["editorial", "bombay", "global"], note: "The original 'Trophy Wife' glow.", popular: true },
        ],
      },
    ],
  },
  {
    step: 5,
    category: "Lips",
    slug: "lips",
    icon: "◈",
    subtitle: "The final statement",
    items: [
      {
        id: "lipliner", name: "Lip Liner", type: "Define",
        brands: [
          { name: "Charlotte Tilbury Lip Cheat", mrp: 2400, looks: ["parisian", "editorial", "no_filter"], note: "Overline specialist. Stays sharp." },
          { name: "M·A·C Lip Pencil", mrp: 1650, looks: ["editorial", "bombay"], note: "Pro match to every shade." },
          { name: "NYX Line Loud", mrp: 699, looks: ["bombay", "no_filter"], note: "Matte. High pigment." },
          { name: "Anastasia Beverly Hills Lip Liner", mrp: 1800, looks: ["editorial", "global"], note: "Creamy precision, the artist's pencil of choice.", popular: true },
        ],
      },
      {
        id: "lipstick", name: "Lipstick", type: "Colour",
        brands: [
          { name: "Dior Rouge Dior", mrp: 5200, looks: ["editorial", "parisian"], note: "The couture lip. Architecture in a bullet." },
          { name: "Charlotte Tilbury Matte Revolution", mrp: 3800, looks: ["parisian", "no_filter"], note: "Comfortable matte. Never drying." },
          { name: "NARS Audacious", mrp: 4100, looks: ["editorial", "bombay"], note: "Amplified satin. Bold presence." },
          { name: "M·A·C Matte", mrp: 1950, looks: ["bombay", "editorial"], note: "The original powerhouse." },
          { name: "Fenty Beauty Stunna Lip Paint", mrp: 2600, looks: ["editorial", "global"], note: "The universal red. Most-searched lip launch ever.", popular: true },
        ],
      },
      {
        id: "setting_spray", name: "Setting Spray", type: "Finish",
        brands: [
          { name: "Charlotte Tilbury Airbrush Flawless", mrp: 3600, looks: ["parisian", "editorial", "no_filter"], note: "Soft-focus finish. Blurs pores." },
          { name: "Urban Decay All Nighter", mrp: 2800, looks: ["editorial", "bombay"], note: "16hr lock. The non-negotiable." },
          { name: "One Size Turn Up the Base", mrp: 2200, looks: ["bombay", "no_filter"], note: "Matte-to-dewy finish options." },
          { name: "Milk Makeup Hydro Grip Setting Spray", mrp: 2400, looks: ["no_filter", "global"], note: "Locks in the glass-skin finish.", popular: true },
        ],
      },
    ],
  },
];

// ─── PRICING ──────────────────────────────────────────────────────────────────
const ARTIST_BASE = 7500;     // artist's fee
const PRODUCT_CAP = 25000;    // max product contribution
const TRAVEL_BASE = 300;      // flat dispatch fee from MG Road, Bengaluru
const TRAVEL_PER_KM = 30;     // per km beyond central Bengaluru

function inr(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

// Brand "logo" plate — extracts the recognisable house name from a product
// listing (e.g. "Fenty Beauty Pro Filt'r Soft Matte" → "Fenty Beauty"),
// rendered as a clean black-on-white logotype plate.
const BRAND_HOUSES = [
  "Anastasia Beverly Hills", "Pat McGrath Labs", "Charlotte Tilbury",
  "House of Lashes", "Velour Lashes", "Too Faced", "Urban Decay",
  "Huda Beauty", "Rare Beauty", "Fenty Beauty", "Milk Makeup",
  "Air Optix", "Bausch + Lomb", "La Roche-Posay", "Then I Met You",
  "Forest Essentials", "Love Earth", "Bobbi Brown", "Laura Mercier",
  "Kiko Milano", "One Size", "Kay Beauty", "Estée Lauder",
  "L.A. Girl", "St. Ives",
].sort((a, b) => b.length - a.length);

function getLogoLabel(name) {
  const house = BRAND_HOUSES.find(h => name.startsWith(h));
  if (house) return house;
  return name.split(" ")[0];
}

// Houses rendered as italic serif wordmarks (fashion / luxury-script feel)
const SERIF_ITALIC = new Set([
  "Charlotte Tilbury", "Huda Beauty", "Pat McGrath Labs", "Estée Lauder",
  "Rare Beauty", "Then I Met You", "Forest Essentials", "Love Earth",
  "Tatcha", "Laneige", "Velour Lashes", "Kiehl's", "House of Lashes",
]);

// Houses rendered as bold, tightly-set sans wordmarks
const BOLD_SANS = new Set([
  "NARS", "Fenty Beauty", "M·A·C", "Too Faced", "Bobbi Brown",
  "Maybelline", "Lakmé", "Tarte",
]);

function BrandLogo({ name, active }) {
  const logo = getLogoLabel(name);
  const color = active ? "#0A0A0A" : "#B9B4AC";
  let style = {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    fontSize: 14,
    letterSpacing: 2,
    textTransform: "uppercase",
    color,
  };
  if (SERIF_ITALIC.has(logo)) {
    style = {
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontStyle: "italic",
      fontWeight: 500,
      fontSize: 19,
      letterSpacing: 0.5,
      color,
    };
  } else if (BOLD_SANS.has(logo)) {
    style = {
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      color,
    };
  }
  return <div className="ae-logo" style={style}>{logo}</div>;
}

function calcPricing(selections, km) {
  const items = Object.values(selections).filter(Boolean);
  const totalMRP = items.reduce((s, b) => s + b.mrp, 0);
  const productCharge = Math.min(totalMRP * 0.2, PRODUCT_CAP);
  const travel = TRAVEL_BASE + TRAVEL_PER_KM * Math.max(0, km);
  const total = productCharge + ARTIST_BASE + travel;
  return { items, totalMRP, productCharge, travel, total };
}

// ─── LOOK SELECTOR ────────────────────────────────────────────────────────────
function LookSelector({ activeLook, onSelect }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ height: 1, flex: 1, background: "#E8E8E8" }} />
        <span style={{ fontSize: 9, letterSpacing: 4, color: "#AAAAAA", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif", whiteSpace: "nowrap" }}>
          Artist-curated looks
        </span>
        <div style={{ height: 1, flex: 1, background: "#E8E8E8" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
        {LOOKS.map(look => {
          const active = activeLook?.id === look.id;
          return (
            <button
              key={look.id}
              onClick={() => onSelect(active ? null : look)}
              style={{
                padding: "16px 18px",
                background: active ? "#0A0A0A" : "#FFFFFF",
                border: active ? "1px solid #0A0A0A" : "1px solid #EBEBEB",
                borderRadius: 3,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                {look.palette.map((c, i) => (
                  <div key={i} style={{ height: 3, flex: 1, background: c, borderRadius: 2 }} />
                ))}
              </div>
              <div style={{ fontSize: 13, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, color: active ? "#FFFFFF" : "#0A0A0A", marginBottom: 4, letterSpacing: 0.5 }}>
                {look.name}
              </div>
              <div style={{ fontSize: 10, color: active ? "#888" : "#AAAAAA", fontFamily: "DM Sans, sans-serif", lineHeight: 1.5 }}>
                {look.tagline}
              </div>
              {active && (
                <div style={{ position: "absolute", top: 10, right: 10, width: 18, height: 18, borderRadius: "50%", background: "#C8A96E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 10, color: "#0A0A0A", fontWeight: 700 }}>✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
      {activeLook && (
        <div style={{ marginTop: 12, padding: "14px 18px", background: "#F7F5F2", borderLeft: "2px solid #C8A96E", borderRadius: "0 3px 3px 0" }}>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "#C8A96E", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif", marginBottom: 6 }}>
            Artist's note
          </div>
          <p style={{ color: "#555", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", margin: 0, lineHeight: 1.7, fontSize: 14 }}>
            "{activeLook.artist_note}"
          </p>
        </div>
      )}
    </div>
  );
}

// ─── BRAND ROW (minimal, no boxes or borders) ─────────────────────────────────
function BrandCard({ brand, selected, isSuggestion, onToggle }) {
  return (
    <button onClick={onToggle} className="ae-brand-row">
      <div className="ae-radio" style={{ borderColor: selected ? "#0A0A0A" : "#D6D6D6" }}>
        {selected && <span className="ae-radio-dot" />}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <BrandLogo name={brand.name} active={selected} />

        <div className="ae-divider" />

        <div className="ae-brand-name" style={{ color: selected ? "#666" : "#AAAAAA" }}>
          {brand.name}
        </div>

        {(isSuggestion || brand.popular) && (
          <div style={{ marginTop: 2 }}>
            {isSuggestion && <span className="ae-tag" style={{ color: "#C8A96E" }}>✦ Artist's Suggestion</span>}
            {brand.popular && <span className="ae-tag" style={{ color: "#BBBBBB" }}>● Most Searched</span>}
          </div>
        )}

        {brand.note && (
          <div className="ae-brand-note" style={{ color: "#999", marginTop: 2 }}>
            {brand.note}
          </div>
        )}
      </div>
    </button>
  );
}

// ─── PRODUCT ROW ──────────────────────────────────────────────────────────────
function ProductRow({ item, index, activeLook, selections, onSelect }) {
  const sel = selections[item.id];
  const isComplete = !!sel;
  const num = String(index + 1).padStart(2, "0");

  return (
    <div className="ae-row">
      <div className="ae-row-num">{num}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 8, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: "#C0B49A", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif", marginBottom: 3 }}>
              {item.type}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h3 style={{ fontSize: 19, fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#0A0A0A", margin: 0, fontWeight: 500, letterSpacing: 0.3 }}>
                {item.name}
              </h3>
              {isComplete && (
                <span style={{ fontSize: 9, color: "#C8A96E", letterSpacing: 2, textTransform: "uppercase", fontFamily: "DM Sans, sans-serif" }}>
                  ✓ Selected
                </span>
              )}
            </div>
          </div>
          {sel && (
            <button
              onClick={() => onSelect(item.id, null)}
              style={{ background: "none", border: "none", fontSize: 11, color: "#CCCCCC", cursor: "pointer", fontFamily: "DM Sans, sans-serif", padding: "4px 8px" }}
            >
              Clear
            </button>
          )}
        </div>
        <div className="ae-brand-grid">
          {item.brands.map(brand => {
            const isSuggestion = activeLook ? brand.looks?.includes(activeLook.id) : false;
            return (
              <BrandCard
                key={brand.name}
                brand={brand}
                selected={sel?.name === brand.name}
                isSuggestion={isSuggestion}
                onToggle={() => onSelect(item.id, sel?.name === brand.name ? null : brand)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── STEP NAV (mobile category tabs) ──────────────────────────────────────────
function StepNav({ steps, active, onSelect, selections }) {
  return (
    <div className="ae-mobile-tabs">
      {steps.map((cat, i) => {
        const done = cat.items.filter(it => selections[it.id]).length;
        const isActive = i === active;
        return (
          <button
            key={cat.slug}
            onClick={() => onSelect(i)}
            style={{
              padding: "12px 16px",
              background: "none",
              border: "none",
              borderBottom: isActive ? "2px solid #0A0A0A" : "2px solid transparent",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 11, fontFamily: "DM Sans, sans-serif", fontWeight: isActive ? 500 : 400, color: isActive ? "#0A0A0A" : "#999", letterSpacing: 0.3 }}>
              {cat.category}
            </div>
            {done > 0 && (
              <div style={{ fontSize: 9, color: "#C8A96E", textAlign: "center", marginTop: 2, fontFamily: "DM Sans, sans-serif" }}>
                {done}/{cat.items.length}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── ESTIMATE PANEL (status only while choosing) ─────────────────────────────
function EstimatePanel({ selections, compact }) {
  const count = Object.values(selections).filter(Boolean).length;
  if (compact) {
    return (
      <div>
        <div style={{ fontSize: 9, letterSpacing: 2, color: "#666", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif" }}>Selected</div>
        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, color: "#FFFFFF", letterSpacing: 1 }}>
          {count} product{count === 1 ? "" : "s"}
        </div>
      </div>
    );
  }
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 3, color: "#555", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif", marginBottom: 16 }}>Your curation</div>
      {count === 0 ? (
        <div style={{ fontSize: 12, color: "#444", fontFamily: "DM Sans, sans-serif", fontStyle: "italic", lineHeight: 1.7 }}>
          Select products as you go — your full, transparent estimate appears once you reach the end.
        </div>
      ) : (
        <>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 36, color: "#FFFFFF", fontWeight: 300, lineHeight: 1 }}>
            {count}
          </div>
          <div style={{ fontSize: 11, color: "#666", fontFamily: "DM Sans, sans-serif", marginTop: 4, marginBottom: 18 }}>
            product{count === 1 ? "" : "s"} selected so far
          </div>
          <div style={{ height: 1, background: "#1E1E1E", marginBottom: 18 }} />
          <p style={{ fontSize: 11, color: "#666", fontFamily: "DM Sans, sans-serif", lineHeight: 1.8, margin: 0 }}>
            Pricing stays hidden while you choose, so brand quality leads the decision. Your complete breakdown is revealed on the estimate page.
          </p>
        </>
      )}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function AmourEstiloV4() {
  const [phase, setPhase] = useState("intro");
  const [clientName, setClientName] = useState("");
  const [activeLook, setActiveLook] = useState(LOOKS[0]);
  const [activeStep, setActiveStep] = useState(0);
  const [selections, setSelections] = useState(() => {
    const sel = {};
    CATALOG.forEach(cat => {
      cat.items.forEach(item => {
        const pick = item.brands.find(b => b.looks?.includes(LOOKS[0].id));
        if (pick) sel[item.id] = pick;
      });
    });
    return sel;
  });
  const [km, setKm] = useState(8);

  const totalSelected = Object.values(selections).filter(Boolean).length;
  const p = calcPricing(selections, km);

  function handleSelect(itemId, brand) {
    setSelections(prev => ({ ...prev, [itemId]: brand || undefined }));
  }

  function applyLookDefaults(look) {
    if (!look) return;
    const newSel = {};
    CATALOG.forEach(cat => {
      cat.items.forEach(item => {
        const pick = item.brands.find(b => b.looks?.includes(look.id));
        if (pick && !selections[item.id]) newSel[item.id] = pick;
      });
    });
    if (Object.keys(newSel).length > 0) setSelections(prev => ({ ...prev, ...newSel }));
  }

  function handleLookSelect(look) {
    setActiveLook(look);
    if (look) applyLookDefaults(look);
  }

  // ── INTRO ──
  if (phase === "intro") {
    return (
      <div className="ae-root" style={{ minHeight: "100vh", background: "#FAFAFA", display: "flex", flexDirection: "column" }}>
        <style>{FONTS}{STYLES}</style>

        {/* Header */}
        <div className="ae-topbar" style={{ background: "#0A0A0A", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, color: "#FFFFFF", letterSpacing: 6, fontWeight: 400 }}>AMOUR ESTILO</div>
            <div style={{ fontSize: 8, letterSpacing: 5, color: "#555", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif", marginTop: 2 }}>Bespoke Makeup Experience</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["●", "●", "●"].map((d, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i === 0 ? "#C8A96E" : "#2A2A2A" }} />
            ))}
          </div>
        </div>

        {/* Hero */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "60px 24px 40px", maxWidth: 560, margin: "0 auto", width: "100%" }}>
          <div style={{ marginBottom: 36, position: "relative" }}>
            <div style={{ width: 72, height: 72, border: "1px solid #E0E0E0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, color: "#0A0A0A", letterSpacing: 3 }}>AE</span>
            </div>
            <div style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, borderRadius: "50%", background: "#C8A96E" }} />
          </div>

          <p style={{ fontSize: 9, letterSpacing: 5, color: "#C8A96E", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif", marginBottom: 16, textAlign: "center" }}>
            Exclusive · Personal · Precise
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(36px, 8vw, 56px)", fontWeight: 300, color: "#0A0A0A", textAlign: "center", margin: "0 0 8px", lineHeight: 1.1, letterSpacing: 1 }}>
            Your makeup,
          </h1>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(36px, 8vw, 56px)", fontWeight: 300, color: "#0A0A0A", textAlign: "center", margin: "0 0 28px", lineHeight: 1.1, letterSpacing: 1, fontStyle: "italic" }}>
            your brands.
          </h1>
          <p style={{ fontSize: 13, color: "#888", lineHeight: 1.9, fontFamily: "DM Sans, sans-serif", textAlign: "center", marginBottom: 40, maxWidth: 400 }}>
            Choose every brand across 20 categories — from Mumbai favourites to the world's most-searched names. Our artist suggests, you decide.
          </p>

          <div style={{ width: "100%", marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 9, letterSpacing: 3, color: "#AAAAAA", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif", marginBottom: 8 }}>
              Your name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && clientName.trim() && setPhase("curate")}
              placeholder="How shall we address you?"
              style={{
                width: "100%",
                padding: "14px 18px",
                fontSize: 14,
                fontFamily: "DM Sans, sans-serif",
                border: "1px solid #E0E0E0",
                borderRadius: 3,
                background: "#FFFFFF",
                color: "#0A0A0A",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>
          <button
            onClick={() => clientName.trim() && setPhase("curate")}
            disabled={!clientName.trim()}
            style={{
              width: "100%",
              padding: "16px",
              background: clientName.trim() ? "#0A0A0A" : "#F0F0F0",
              color: clientName.trim() ? "#FFFFFF" : "#CCCCCC",
              border: "none",
              borderRadius: 3,
              fontSize: 10,
              letterSpacing: 3,
              textTransform: "uppercase",
              cursor: clientName.trim() ? "pointer" : "default",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
          >
            Begin my curation →
          </button>

          <div style={{ display: "flex", gap: 24, marginTop: 48, flexWrap: "wrap", justifyContent: "center" }}>
            {[["20", "categories"], ["5", "curated looks"], ["45+", "premium brands"], ["100%", "transparent pricing"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, color: "#0A0A0A", fontWeight: 400 }}>{n}</div>
                <div style={{ fontSize: 9, letterSpacing: 2, color: "#BBBBBB", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── SUMMARY ──
  if (phase === "summary") {
    return (
      <div className="ae-root" style={{ minHeight: "100vh", background: "#FAFAFA" }}>
        <style>{FONTS}{STYLES}</style>
        {/* Nav */}
        <div className="ae-topbar" style={{ background: "#0A0A0A", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: "#FFFFFF", letterSpacing: 5 }}>AMOUR ESTILO</div>
          <button onClick={() => setPhase("curate")} style={{ background: "none", border: "0.5px solid #333", color: "#666", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", padding: "7px 14px", cursor: "pointer", fontFamily: "DM Sans, sans-serif", borderRadius: 2 }}>
            ← Edit selections
          </button>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px 80px" }}>
          <p style={{ fontSize: 9, letterSpacing: 4, color: "#C8A96E", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif", marginBottom: 8 }}>
            Personalised for
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 300, color: "#0A0A0A", margin: "0 0 6px", letterSpacing: 1 }}>
            {clientName}'s exclusive look
          </h2>
          {activeLook && (
            <p style={{ fontSize: 13, color: "#888", fontFamily: "DM Sans, sans-serif", fontStyle: "italic", margin: "0 0 36px" }}>
              Curated around: {activeLook.name}
            </p>
          )}

          {/* Selected products */}
          <div style={{ marginBottom: 8 }}>
            {CATALOG.map(cat => {
              const done = cat.items.filter(it => selections[it.id]);
              if (!done.length) return null;
              return (
                <div key={cat.slug} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: "#C8A96E", fontFamily: "DM Sans, sans-serif" }}>{cat.icon}</span>
                    <span style={{ fontSize: 9, letterSpacing: 3, color: "#AAAAAA", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif" }}>{cat.category}</span>
                    <div style={{ flex: 1, height: "0.5px", background: "#EBEBEB" }} />
                  </div>
                  {done.map(item => {
                    const brand = selections[item.id];
                    const isSuggestion = activeLook?.id && brand.looks?.includes(activeLook.id);
                    return (
                      <div key={item.id} className="ae-list-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 9, color: "#C0B49A", fontFamily: "DM Sans, sans-serif", marginBottom: 5, textTransform: "uppercase", letterSpacing: 2 }}>{item.name}</div>
                          <BrandLogo name={brand.name} active={true} />
                          <div style={{ fontSize: 11, color: "#AAAAAA", fontFamily: "DM Sans, sans-serif", marginTop: 4 }}>{brand.name}</div>
                          {(isSuggestion || brand.popular) && (
                            <div style={{ display: "flex", gap: 10, marginTop: 5, flexWrap: "wrap" }}>
                              {isSuggestion && <span className="ae-tag" style={{ color: "#C8A96E" }}>✦ Artist's Suggestion</span>}
                              {brand.popular && <span className="ae-tag" style={{ color: "#BBBBBB" }}>● Most Searched</span>}
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize: 13, color: "#999", fontFamily: "'Cormorant Garamond', Georgia, serif", flexShrink: 0, marginTop: 2 }}>{inr(brand.mrp)}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Distance */}
          <div className="ae-list-row" style={{ marginTop: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: "#AAAAAA", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif" }}>
                  Your location · distance from MG Road, central Bengaluru
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, color: "#0A0A0A" }}>{km} km</div>
              </div>
              <input
                type="range" min="0" max="50" step="1" value={km}
                onChange={e => setKm(Number(e.target.value))}
                className="ae-slider-light"
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 9, color: "#CCCCCC", fontFamily: "DM Sans, sans-serif", letterSpacing: 1 }}>
                <span>0 km</span>
                <span>50 km</span>
              </div>
            </div>
          </div>

          {/* Pricing breakdown — clean, low-contrast, three simple charges */}
          <div style={{ marginTop: 36 }}>
            <div style={{ padding: "20px 22px", background: "#F7F5F2", borderLeft: "2px solid #C8A96E", borderRadius: "0 3px 3px 0", marginBottom: 22, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", border: "1px solid #C8A96E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "#FFFFFF" }}>
                <span style={{ fontSize: 17, color: "#C8A96E" }}>◈</span>
              </div>
              <div>
                <div style={{ fontSize: 9, letterSpacing: 4, color: "#C8A96E", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif", marginBottom: 4 }}>
                  Your estimate
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(22px, 4vw, 28px)", color: "#0A0A0A", fontWeight: 300, letterSpacing: 0.5 }}>
                  Three simple charges
                </div>
              </div>
            </div>

            <div className="ae-list-row">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#0A0A0A", fontFamily: "DM Sans, sans-serif" }}>Product cost</div>
                <div style={{ fontSize: 11, color: "#AAAAAA", fontFamily: "DM Sans, sans-serif", marginTop: 2 }}>
                  20% of {inr(p.totalMRP)} MRP{p.totalMRP * 0.2 > PRODUCT_CAP ? `, capped at ${inr(PRODUCT_CAP)}` : ""}
                </div>
              </div>
              <span style={{ fontSize: 16, color: "#0A0A0A", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{inr(p.productCharge)}</span>
            </div>
            <div className="ae-list-row">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#0A0A0A", fontFamily: "DM Sans, sans-serif" }}>Artist cost</div>
                <div style={{ fontSize: 11, color: "#AAAAAA", fontFamily: "DM Sans, sans-serif", marginTop: 2 }}>Guaranteed minimum fee</div>
              </div>
              <span style={{ fontSize: 16, color: "#0A0A0A", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{inr(ARTIST_BASE)}</span>
            </div>
            <div className="ae-list-row">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#0A0A0A", fontFamily: "DM Sans, sans-serif" }}>Travel charge</div>
                <div style={{ fontSize: 11, color: "#AAAAAA", fontFamily: "DM Sans, sans-serif", marginTop: 2 }}>
                  {inr(TRAVEL_BASE)} base + {inr(TRAVEL_PER_KM)}/km × {km} km from MG Road
                </div>
              </div>
              <span style={{ fontSize: 16, color: "#0A0A0A", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{inr(p.travel)}</span>
            </div>

            {/* Total — quiet emphasis via rule + large serif figure, no filled block */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 22, paddingTop: 18, borderTop: "1px solid #C8A96E" }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: 3, color: "#AAAAAA", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif" }}>Total estimate</div>
                <div style={{ fontSize: 11, color: "#BBBBBB", fontFamily: "DM Sans, sans-serif", marginTop: 2 }}>Product + artist + travel</div>
              </div>
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 36, color: "#0A0A0A", fontWeight: 300 }}>{inr(p.total)}</span>
            </div>
            <p style={{ fontSize: 10, color: "#BBBBBB", lineHeight: 1.8, fontFamily: "DM Sans, sans-serif", marginTop: 14 }}>
              * Final quote confirmed at booking. Artist minimum ₹7,500. Product contribution capped at ₹25,000. Travel calculated from MG Road, central Bengaluru.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap" }}>
            <button style={{ flex: 2, minWidth: 180, padding: "16px", background: "#0A0A0A", color: "#FFFFFF", border: "none", borderRadius: 3, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 500 }}>
              Book this look
            </button>
            <button onClick={() => {
              const sel = {};
              CATALOG.forEach(cat => cat.items.forEach(item => {
                const pick = item.brands.find(b => b.looks?.includes(LOOKS[0].id));
                if (pick) sel[item.id] = pick;
              }));
              setSelections(sel); setActiveLook(LOOKS[0]); setPhase("intro"); setClientName("");
            }}
              style={{ flex: 1, minWidth: 140, padding: "16px", background: "transparent", color: "#0A0A0A", border: "1px solid #E0E0E0", borderRadius: 3, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
              Start over
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── CURATION ──
  return (
    <div className="ae-root" style={{ minHeight: "100vh", background: "#FAFAFA" }}>
      <style>{FONTS}{STYLES}</style>

      {/* Sticky header */}
      <div className="ae-topbar" style={{ background: "#0A0A0A", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, gap: 16 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, color: "#FFFFFF", letterSpacing: 5, flexShrink: 0 }}>AMOUR ESTILO</div>
        {activeLook && (
          <div className="ae-look-indicator">
            <span style={{ fontSize: 8, letterSpacing: 2, color: "#C8A96E", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif" }}>Look:</span>
            <span style={{ fontSize: 11, color: "#888", fontFamily: "DM Sans, sans-serif" }}>{activeLook.name}</span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <EstimatePanel selections={selections} compact={true} />
          <button
            onClick={() => setPhase("summary")}
            disabled={totalSelected === 0}
            style={{
              background: totalSelected > 0 ? "#C8A96E" : "#1E1E1E",
              color: totalSelected > 0 ? "#0A0A0A" : "#444",
              border: "none",
              padding: "9px 18px",
              fontSize: 9,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: totalSelected > 0 ? "pointer" : "default",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 600,
              borderRadius: 2,
              flexShrink: 0,
              transition: "all 0.2s",
            }}
          >
            View estimate →
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="ae-main">

        {/* Left sidebar — desktop only */}
        <div className="ae-side-left">
          <div style={{ fontSize: 9, letterSpacing: 3, color: "#AAAAAA", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif", marginBottom: 16, paddingLeft: 12 }}>
            {clientName}'s curation
          </div>
          {CATALOG.map((cat, i) => {
            const done = cat.items.filter(it => selections[it.id]).length;
            const isActive = i === activeStep;
            return (
              <button key={cat.slug} onClick={() => setActiveStep(i)} style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 12px",
                background: isActive ? "#F5F5F5" : "transparent",
                border: "none",
                borderLeft: isActive ? "2px solid #0A0A0A" : "2px solid transparent",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
                borderRadius: "0 3px 3px 0",
              }}>
                <span style={{ fontSize: 12, color: isActive ? "#0A0A0A" : "#CCCCCC", width: 16, textAlign: "center", fontFamily: "DM Sans, sans-serif" }}>{cat.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: isActive ? "#0A0A0A" : "#777", fontFamily: "DM Sans, sans-serif", fontWeight: isActive ? 500 : 400 }}>{cat.category}</div>
                  <div style={{ fontSize: 9, color: done > 0 ? "#C8A96E" : "#DDDDDD", fontFamily: "DM Sans, sans-serif", marginTop: 1 }}>
                    {done > 0 ? `${done} of ${cat.items.length} selected` : `${cat.items.length} products`}
                  </div>
                </div>
                {done === cat.items.length && <span style={{ fontSize: 10, color: "#C8A96E" }}>✓</span>}
              </button>
            );
          })}

          <div style={{ marginTop: "auto", padding: "20px 12px 0", borderTop: "0.5px solid #EBEBEB" }}>
            {totalSelected > 0 && (
              <>
                <div style={{ fontSize: 9, letterSpacing: 2, color: "#AAAAAA", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif", marginBottom: 6 }}>Selected so far</div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, color: "#0A0A0A", fontWeight: 400 }}>{totalSelected} products</div>
                <div style={{ fontSize: 10, color: "#BBBBBB", fontFamily: "DM Sans, sans-serif", marginTop: 2 }}>Pricing shown on your estimate page</div>
              </>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="ae-content">
          {/* Mobile category tabs */}
          <StepNav steps={CATALOG} active={activeStep} onSelect={setActiveStep} selections={selections} />

          {/* Look picker — shown on first step */}
          {activeStep === 0 && (
            <div style={{ marginBottom: 8 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, color: "#0A0A0A", fontWeight: 300, margin: "0 0 6px", letterSpacing: 0.5 }}>
                Choose your look
              </h2>
              <p style={{ fontSize: 12, color: "#999", fontFamily: "DM Sans, sans-serif", margin: "0 0 24px", lineHeight: 1.7 }}>
                Select a look and our artist suggests the best brands for it — including the most-searched names worldwide. Swap anything you like — you're always in control.
              </p>
              <LookSelector activeLook={activeLook} onSelect={handleLookSelect} />
            </div>
          )}

          {/* Category heading */}
          <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "0.5px solid #EBEBEB" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 4 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid #E5E1D8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "#FFFFFF" }}>
                <span style={{ fontSize: 18, color: "#C8A96E" }}>{CATALOG[activeStep].icon}</span>
              </div>
              <div>
                <span style={{ fontSize: 9, letterSpacing: 4, color: "#AAAAAA", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif" }}>
                  {String(activeStep + 1).padStart(2, "0")} / {String(CATALOG.length).padStart(2, "0")}
                </span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 300, color: "#0A0A0A", margin: "2px 0 0", letterSpacing: 0.5 }}>
                  {CATALOG[activeStep].category}
                </h2>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "#999", fontFamily: "DM Sans, sans-serif", margin: "0 0 0 64px", fontStyle: "italic" }}>
              {CATALOG[activeStep].subtitle}
            </p>
            {activeLook && (
              <p style={{ margin: "10px 0 0 64px", fontSize: 10, color: "#999", fontFamily: "DM Sans, sans-serif", letterSpacing: 0.5 }}>
                <span style={{ color: "#C8A96E" }}>✦ Artist's Suggestion</span> — recommended for {activeLook.name}.{"  "}
                <span style={{ color: "#BBBBBB" }}>● Most Searched</span> — the world's most-searched pick in this category.
              </p>
            )}
          </div>

          {/* Products */}
          {CATALOG[activeStep].items.map((item, idx) => (
            <ProductRow
              key={item.id}
              item={item}
              index={idx}
              activeLook={activeLook}
              selections={selections}
              onSelect={handleSelect}
            />
          ))}

          {/* Step navigation */}
          <div style={{ display: "flex", gap: 10, marginTop: 8, paddingTop: 24, borderTop: "0.5px solid #EBEBEB" }}>
            {activeStep > 0 && (
              <button onClick={() => { setActiveStep(s => s - 1); window.scrollTo(0, 0); }}
                style={{ padding: "12px 22px", background: "transparent", border: "1px solid #E0E0E0", borderRadius: 3, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "DM Sans, sans-serif", color: "#888" }}>
                ← Back
              </button>
            )}
            {activeStep < CATALOG.length - 1 ? (
              <button onClick={() => { setActiveStep(s => s + 1); window.scrollTo(0, 0); }}
                style={{ flex: 1, padding: "14px", background: "#0A0A0A", color: "#FFFFFF", border: "none", borderRadius: 3, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 500 }}>
                Next: {CATALOG[activeStep + 1].category} →
              </button>
            ) : (
              <button onClick={() => setPhase("summary")}
                style={{ flex: 1, padding: "14px", background: "#C8A96E", color: "#0A0A0A", border: "none", borderRadius: 3, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>
                See my personalised estimate →
              </button>
            )}
          </div>
        </div>

        {/* Right panel — live status (desktop) */}
        <div className="ae-side-right">
          <EstimatePanel selections={selections} compact={false} />
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="ae-mobile-bar" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0A0A0A", borderTop: "0.5px solid #1A1A1A", padding: "12px 20px", alignItems: "center", justifyContent: "space-between", zIndex: 99 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 2, color: "#555", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif" }}>Selected</div>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, color: totalSelected > 0 ? "#C8A96E" : "#333" }}>
            {totalSelected > 0 ? `${totalSelected} products` : "—"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {activeStep < CATALOG.length - 1 ? (
            <button onClick={() => { setActiveStep(s => s + 1); }}
              style={{ background: "#FFFFFF", color: "#0A0A0A", border: "none", padding: "10px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 600, borderRadius: 2 }}>
              Next →
            </button>
          ) : (
            <button onClick={() => setPhase("summary")}
              style={{ background: "#C8A96E", color: "#0A0A0A", border: "none", padding: "10px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 600, borderRadius: 2 }}>
              Estimate →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}