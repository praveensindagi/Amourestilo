import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─── GOOGLE FONTS (kept as the Amour Estilo standard pairing) ────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;1,6..96,400&display=swap');`;

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
  .ae-row-num { flex-shrink: 0; width: 36px; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #E0DBD4; line-height: 1; }
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
    id: "bridal",
    name: "The Bride",
    tagline: "Timeless. Radiant. Unforgettable.",
    mood: "Dewy base. Lifted eyes. Nude-rose lip.",
    palette: ["#F5E6D8", "#D4A090", "#C8B8A2"],
    artist_note: "Bridal makeup has one job — you must look like yourself, only better. We build this look to last 12 hours through tears, heat and flash photography.",
  },
  {
    id: "soft_glam",
    name: "Soft Glam",
    tagline: "Effortless. Luminous. Universally flattering.",
    mood: "Satin base. Warm eye. Glossy lip.",
    palette: ["#EDD5C0", "#C9967A", "#F0DDD0"],
    artist_note: "The look everyone asks for — polished enough to photograph beautifully, relaxed enough to feel like you. Works for receptions, mehendi, sangeet, and family portraits alike.",
  },
  {
    id: "party",
    name: "Party Night",
    tagline: "Bold. Defined. Camera-ready.",
    mood: "Full coverage. Smoky eye. Statement lip.",
    palette: ["#1A1A2E", "#8B0000", "#C8A96E"],
    artist_note: "For evenings that go late. I build this for dance floors, dim lighting and Instagram — high pigment, sealed to last.",
  },
  {
    id: "festive",
    name: "Festive & Mehendi",
    tagline: "Warm. Gilded. Traditionally precise.",
    mood: "Golden hour skin. Kohl depth. Rich lip.",
    palette: ["#C8860A", "#8B4513", "#D4AF37"],
    artist_note: "Built for Indian light — artificial and natural both. Pigments that read across a room, rich enough to complement jewellery and lehengas.",
  },
  {
    id: "daytime",
    name: "Daytime & Events",
    tagline: "Fresh. Polished. No-filter skin.",
    mood: "Skincare-led base. Soft brows. Glassy finish.",
    palette: ["#E8D5C4", "#C4A882", "#F5F0EB"],
    artist_note: "For brunches, corporate events, courthouse ceremonies and family functions where you want to look put-together without looking like you tried too hard.",
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
        id: "micellar", name: "Micellar Water", type: "Cleanse",
        brands: [
          { name: "Bioderma Sensibio H2O", mrp: 1200, looks: ["bridal","soft_glam","daytime","party","festive"], note: "The original cult micellar. Dermatologist-grade, zero irritation.", artist: true },
          { name: "Garnier Micellar", mrp: 499, looks: ["daytime","festive"], note: "Accessible everyday cleanser. Gentle on all skin types." },
        ],
      },
      {
        id: "face_scrub", name: "Face Scrub", type: "Exfoliate",
        brands: [
          { name: "PAC Lemon Squash", mrp: 695, looks: ["festive","soft_glam"], note: "Brightening. Preps skin for a luminous base.", artist: true },
          { name: "Huda Beauty Wishful Scrub", mrp: 2800, looks: ["bridal","party"], note: "Enzyme + physical blend. Glass skin prep.", popular: true },
        ],
      },
      {
        id: "sheet_mask", name: "Sheet Mask", type: "Prep",
        brands: [
          { name: "Biodence", mrp: 1200, looks: ["bridal","soft_glam","daytime"], note: "Intensive hydration mask. Plumps skin pre-makeup.", artist: true },
          { name: "Nykaa9", mrp: 399, looks: ["daytime","festive"], note: "Targeted treatment masks. Accessible and effective." },
        ],
      },
      {
        id: "under_eye", name: "Under Eye Mask", type: "Prep",
        brands: [
          { name: "PIXI", mrp: 1800, looks: ["bridal","soft_glam","party"], note: "Collagen patches. De-puffs and brightens before concealer." },
          { name: "MCaffeine", mrp: 699, looks: ["daytime","festive"], note: "Caffeine-infused. Reduces dark circles and puffiness." },
        ],
      },
      {
        id: "toner", name: "Toner", type: "Tone",
        brands: [
          { name: "Forest Essentials Tejal Water", mrp: 1250, looks: ["bridal","soft_glam","festive"], note: "Rose + saffron. Glow-inducing. Beloved bridal prep.", artist: true },
          { name: "D'alba Peptide Serum Toner", mrp: 2600, looks: ["bridal","soft_glam","daytime"], note: "White truffle peptide. Deeply nourishing glass-skin toner.", artist: true },
          { name: "Love Earth Rose Toner", mrp: 549, looks: ["daytime","festive"], note: "Gentle pH balance. Clean formula." },
        ],
      },
      {
        id: "moisturiser", name: "Moisturiser", type: "Hydrate",
        brands: [
          { name: "Embryolisse Lait-Crème", mrp: 1800, looks: ["bridal","soft_glam","party"], note: "Backstage staple since 1950. Doubles as a primer base.", artist: true },
          { name: "Flicka Barrier Cream", mrp: 850, looks: ["daytime","festive"], note: "Indian skin-friendly barrier formula.", artist: true },
          { name: "PAC Spot Light", mrp: 799, looks: ["festive","daytime"], note: "Illuminating moisturiser. Adds a natural glow under base." },
          { name: "Bobbi Brown Intensive Skin", mrp: 4200, looks: ["bridal","party"], note: "Weightless long-wear hydration. Stays all day.", artist: true },
          { name: "Innisfree Green Tea Seed Cream", mrp: 1800, looks: ["soft_glam","daytime"], note: "K-beauty classic. Balances hydration without heaviness." },
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
          { name: "M·A·C Prep + Prime", mrp: 2750, looks: ["bridal","party","festive"], note: "Longwear lock. 8-hour hold in Indian heat.", artist: true },
          { name: "Smashbox Photo Finish", mrp: 3200, looks: ["bridal","soft_glam","party"], note: "The photographer's choice. Airbrushed skin finish.", artist: true },
          { name: "Huda Beauty GloWish", mrp: 2600, looks: ["soft_glam","festive"], note: "Luminous base primer. Natural glow effect." },
          { name: "e.l.f. Poreless Putty", mrp: 899, looks: ["daytime","festive"], note: "Blurs pores. Grips foundation." },
          { name: "Milk Makeup Hydro Grip", mrp: 2600, looks: ["daytime","soft_glam"], note: "Internet-famous grip + glow primer." },
          { name: "Recode Ace The Base", mrp: 699, looks: ["daytime","festive"], note: "Affordable longwear primer. Matte-finish control." },
        ],
      },
      {
        id: "foundation", name: "Foundation", type: "Base",
        brands: [
          { name: "Estée Lauder Double Wear", mrp: 4600, looks: ["bridal","party","festive"], note: "24hr. Transfers to nothing. The bridal standard.", artist: true },
          { name: "NARS Natural Radiant Longwear", mrp: 5200, looks: ["bridal","soft_glam"], note: "Luminous skin finish. Looks like skin, lasts like makeup.", artist: true },
          { name: "M·A·C Studio Fix Fluid", mrp: 3400, looks: ["party","festive"], note: "Full coverage matte. Pro workhorse." },
          { name: "Haus Labs Triclone Skin Tech", mrp: 4800, looks: ["soft_glam","daytime"], note: "Skincare-makeup hybrid. Breathable, skin-forward." },
          { name: "Valentino Very Valentino", mrp: 5800, looks: ["bridal","party"], note: "Couture-house foundation. Soft velvet finish." },
          { name: "Dior Forever Foundation", mrp: 5500, looks: ["bridal","soft_glam"], note: "24hr skin-perfecting. The French house's benchmark." },
          { name: "Charlotte Tilbury Airbrush Flawless", mrp: 4900, looks: ["bridal","soft_glam","party"], note: "Airbrushed satin finish. Universally flattering." },
          { name: "PAC HD Foundation", mrp: 1200, looks: ["festive","daytime"], note: "High-coverage Indian skin range." },
          { name: "YSL All Hours Foundation", mrp: 5200, looks: ["party","festive"], note: "Extreme-wear. Built for long nights." },
        ],
      },
      {
        id: "concealer", name: "Concealer", type: "Cover",
        brands: [
          { name: "Huda Beauty The Overachiever", mrp: 2900, looks: ["bridal","party","festive"], note: "Long-wear, high coverage. Loved for deep skin tones." },
          { name: "Too Faced Born This Way", mrp: 2800, looks: ["soft_glam","daytime"], note: "Natural finish. Buildable. Foundation-shade matched." },
          { name: "Tarte Shape Tape", mrp: 2600, looks: ["party","festive"], note: "Full-coverage under-eye precision. Cult formula." },
          { name: "Hourglass Vanish Seamless Finish", mrp: 3800, looks: ["bridal","soft_glam"], note: "Invisible seam-free coverage. Ultra-fine texture." },
          { name: "L.A. Girl Pro Conceal", mrp: 699, looks: ["daytime","festive"], note: "High pigment. Artists' budget kit staple." },
          { name: "M·A·C Studio Fix Concealer", mrp: 2100, looks: ["party","festive"], note: "Matte finish. 24hr wear." },
        ],
      },
      {
        id: "compact_powder", name: "Compact Powder", type: "Set",
        brands: [
          { name: "M·A·C Compact Powder", mrp: 2200, looks: ["festive","party","daytime"], note: "Travel-ready. Reliable. Pro-kit standard." },
          { name: "Charlotte Tilbury Flawless Finish", mrp: 4200, looks: ["bridal","soft_glam"], note: "Skin-perfecting finish powder. Blurs and sets." },
        ],
      },
      {
        id: "loose_powder", name: "Loose Setting Powder", type: "Set",
        brands: [
          { name: "Laura Mercier Translucent", mrp: 4800, looks: ["bridal","soft_glam","party","daytime"], note: "The industry standard. Soft-focus, invisible finish." },
          { name: "Hourglass Veil Translucent", mrp: 5200, looks: ["bridal","soft_glam"], note: "Ultra-fine. Photography-perfect, pore-diffusing." },
          { name: "PAC HD Powder", mrp: 999, looks: ["festive","daytime"], note: "Affordable professional setting powder." },
        ],
      },
    ],
  },
  {
    step: 3,
    category: "Eyes",
    slug: "eyes",
    icon: "◇",
    subtitle: "Where the story is told",
    items: [
      {
        id: "eyeshadow", name: "Eyeshadow Palette", type: "Colour",
        brands: [
          { name: "P.Louise Wedding Wish", mrp: 4800, looks: ["bridal","soft_glam"], note: "Made for brides. Ethereal pinks, neutrals and champagnes." },
          { name: "Natasha Denona Nude Glow", mrp: 7200, looks: ["bridal","soft_glam","daytime"], note: "Perfect neutral artist palette. Buttery formula." },
          { name: "Patrick Ta Major Beauty Headlines", mrp: 6800, looks: ["party","festive"], note: "High-drama, celeb MUA formula. Editorial power." },
          { name: "Makeup By Mario Master Mattes", mrp: 5500, looks: ["soft_glam","daytime","party"], note: "Seamless blendability. Kim K's artist — industry gold." },
          { name: "Makerimia", mrp: 3200, looks: ["festive","party"], note: "Bold pigment. Rich festive shades." },
        ],
      },
      {
        id: "eyebrow", name: "Eyebrow Filler", type: "Define",
        brands: [
          { name: "Anastasia Beverly Hills Brow Wiz", mrp: 2400, looks: ["bridal","soft_glam","party","daytime","festive"], note: "The world's #1 brow pencil. Micro-stroke precision." },
          { name: "PAC Brow Definer", mrp: 499, looks: ["daytime","festive"], note: "Buildable colour. Accessible artist staple." },
          { name: "e.l.f. Brow Lift", mrp: 699, looks: ["daytime","soft_glam"], note: "Soap-brow effect in a wax. Sets and grooms." },
        ],
      },
      {
        id: "kajal", name: "Kajal", type: "Define",
        brands: [
          { name: "Forever 52 Kajal", mrp: 450, looks: ["festive","party"], note: "Intensely black. Long-lasting Indian classic.", popular: true },
          { name: "M·A·C Eye Kohl", mrp: 1650, looks: ["party","bridal"], note: "Smudge-fast precision. Intense pro-grade black." },
          { name: "Chambor Kajal", mrp: 850, looks: ["soft_glam","daytime"], note: "Creamy and long-wearing. Gentle on the waterline." },
        ],
      },
      {
        id: "mascara", name: "Mascara", type: "Lashes",
        brands: [
          { name: "M·A·C Extended Play Mascara", mrp: 1950, looks: ["bridal","soft_glam","festive"], note: "Length + curl with no flaking. Bridal favourite." },
          { name: "Maybelline Lash Sensational Sky High", mrp: 950, looks: ["daytime","festive","party"], note: "Most-searched mascara globally. Fan brush for drama.", popular: true },
          { name: "Too Faced Better Than Sex", mrp: 2900, looks: ["party","festive","bridal"], note: "Volume + length. The benchmark mascara." },
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
          { name: "Huda Beauty Blush Palette", mrp: 5200, looks: ["festive","party"], note: "Six coordinated shades. Buildable from subtle to bold." },
          { name: "o2o Mineral Blush", mrp: 699, looks: ["daytime","festive"], note: "Clean mineral formula. Skin-safe." },
          { name: "Rhode Peptide Blush", mrp: 2800, looks: ["soft_glam","daytime"], note: "Hailey Bieber's formula. Dewy lit-from-within flush.", popular: true },
          { name: "K-Beauty Cream Blush", mrp: 1200, looks: ["soft_glam","daytime"], note: "Glass-skin compatible. Blends into base seamlessly." },
          { name: "M·A·C Powder Blush", mrp: 2400, looks: ["bridal","party","festive"], note: "Pro standard. Every skin tone. Buildable." },
          { name: "Hourglass Ambient Lighting Blush", mrp: 4800, looks: ["bridal","soft_glam"], note: "Light-diffusing technology. Ethereal on-camera glow.", popular: true },
          { name: "Rare Beauty Soft Pinch Liquid", mrp: 2950, looks: ["soft_glam","daytime"], note: "Blurs into skin. Effortless just-pinched flush." },
          { name: "Dior Rosy Glow Blush", mrp: 5500, looks: ["bridal","soft_glam"], note: "Maison Dior. Adapts to skin tone. Iconic compact." },
          { name: "Gucci Luminous Matte Beauty Blush", mrp: 5800, looks: ["party","festive"], note: "House of Gucci. Velvety matte with satin finish." },
          { name: "Flower Knows Blush", mrp: 1800, looks: ["soft_glam","daytime"], note: "Fantasy compact. Finely-milled, buildable colour." },
          { name: "Haus Labs Colour Fuse Blush", mrp: 3200, looks: ["party","bridal"], note: "Lady Gaga's formula. Colour-fusing tech, blur finish." },
          { name: "Beautilicious Blush", mrp: 599, looks: ["daytime","festive"], note: "Indian brand. Skin-safe, vibrant pigment." },
        ],
      },
      {
        id: "highlighter", name: "Highlighter", type: "Glow",
        brands: [
          { name: "Rare Beauty Positive Light Liquid", mrp: 2800, looks: ["soft_glam","daytime","bridal"], note: "Liquid. Lit-from-within effect. Not glittery — just light." },
          { name: "OFRA Glow", mrp: 2400, looks: ["party","festive","bridal"], note: "Buildable from glow to blinding. Festival and bridal both.", popular: true },
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
        id: "lip_scrub", name: "Lip Scrub", type: "Prep",
        brands: [
          { name: "Forest Essentials Lip Scrub", mrp: 895, looks: ["bridal","soft_glam","festive"], note: "Sugar + botanical oils. Preps lips for liner and colour.", artist: true },
          { name: "e.l.f. Lip Exfoliator", mrp: 499, looks: ["daytime","party"], note: "Sweet vanilla sugar scrub. Gentle daily use." },
        ],
      },
      {
        id: "lip_balm", name: "Lip Balm / Mask", type: "Prep",
        brands: [
          { name: "Laneige Lip Sleeping Mask", mrp: 1800, looks: ["bridal","soft_glam","daytime","party","festive"], note: "The world's most-repurchased lip mask. Plumps and repairs.", popular: true },
          { name: "Sebamed Lip Defense", mrp: 450, looks: ["daytime","festive"], note: "Medical-grade pH-balanced lip care." },
        ],
      },
      {
        id: "lip_liner", name: "Lip Liner", type: "Define",
        brands: [
          { name: "MARS Lip Liner", mrp: 299, looks: ["festive","daytime"], note: "Affordable precision. Wide Indian shade range." },
          { name: "M·A·C Lip Pencil", mrp: 1650, looks: ["bridal","party","festive"], note: "Pro match to every lipstick shade. Sharp and long-wearing." },
          { name: "PAC Lip Liner", mrp: 449, looks: ["festive","daytime"], note: "Rich colour. Stays put. Artist kit regular." },
          { name: "Colorbar Lip Liner", mrp: 599, looks: ["daytime","soft_glam"], note: "Smooth application. Wide shade range." },
          { name: "Chambor Lip Liner", mrp: 850, looks: ["soft_glam","bridal"], note: "Creamy and precise. Complements couture lip looks." },
          { name: "Charlotte Tilbury Lip Cheat", mrp: 2400, looks: ["bridal","soft_glam","party"], note: "Overline specialist. Stays razor-sharp all day.", popular: true },
        ],
      },
      {
        id: "lipstick", name: "Lipstick", type: "Colour",
        brands: [
          { name: "Sephora Collection Cream Lip Stain", mrp: 1200, looks: ["soft_glam","daytime"], note: "24hr liquid lip. Won't transfer. 100+ shades.", popular: true },
          { name: "Huda Beauty Power Bullet", mrp: 2800, looks: ["festive","party","bridal"], note: "Intense saturation. Stays through meals and festivities." },
          { name: "Kylie Cosmetics Velvet Lip Kit", mrp: 2200, looks: ["party","festive"], note: "Matte liquid + liner kit. The original viral formula." },
          { name: "Staze Beauty Lip Velvet", mrp: 1600, looks: ["soft_glam","daytime"], note: "Comfortable matte. Never drying. Clean formula." },
          { name: "Fae Beauty Lip Crayon", mrp: 799, looks: ["daytime","soft_glam"], note: "Indian indie brand. Inclusive shades for South Asian skin." },
          { name: "Kiko Milano Unlimited Double Touch", mrp: 1400, looks: ["soft_glam","festive","bridal"], note: "Italian precision. Long-wear with gloss top-coat built in." },
        ],
      },
      {
        id: "setting_spray", name: "Setting Spray", type: "Finish",
        brands: [
          { name: "Charlotte Tilbury Airbrush Flawless Finish", mrp: 3600, looks: ["bridal","soft_glam","daytime"], note: "Soft-focus finish. Blurs pores and sets makeup.", popular: true },
          { name: "Urban Decay All Nighter", mrp: 2800, looks: ["party","festive"], note: "16hr lock. The non-negotiable for long event nights." },
          { name: "PAC Setting Spray", mrp: 699, looks: ["festive","daytime"], note: "Affordable longwear seal. Artist kit essential." },
          { name: "M·A·C Fix+", mrp: 1950, looks: ["bridal","soft_glam","party","festive"], note: "Hydrating skin-refresher + setting spray. Pro standard." },
          { name: "One Size Turn Up the Base", mrp: 2200, looks: ["party","festive"], note: "Matte-to-dewy options. Climate-control formula." },
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
  "Anastasia Beverly Hills", "Charlotte Tilbury", "Hourglass",
  "Too Faced", "Rare Beauty", "Haus Labs", "Huda Beauty",
  "Flower Knows", "Makeup By Mario", "Patrick Ta",
  "Natasha Denona", "Kylie Cosmetics", "Urban Decay",
  "Bobbi Brown", "Laura Mercier", "Forest Essentials",
  "Milk Makeup", "Estée Lauder", "Rhode", "OFRA",
  "Fae Beauty", "Kiko Milano", "Love Earth",
  "e.l.f.", "L.A. Girl", "Colorbar", "MCaffeine",
  "Chambor", "Sephora", "Staze Beauty", "Flower Knows",
  "Haus Labs", "Beautilicious", "P.Louise", "Smashbox",
  "Recode", "Embryolisse", "Innisfree", "Seba Med", "Laneige",
  "D'alba", "Sebamed", "Biodence", "Forever 52", "PIXI",
  "M·A·C",
].sort((a, b) => b.length - a.length);

function getLogoLabel(name) {
  const house = BRAND_HOUSES.find(h => name.startsWith(h));
  if (house) return house;
  return name.split(/[\s·]/)[0];
}

const SERIF_ITALIC = new Set([
  "Charlotte Tilbury", "Huda Beauty", "Patrick Ta", "Estée Lauder",
  "Rare Beauty", "Forest Essentials", "Love Earth", "Natasha Denona",
  "Laneige", "Flower Knows", "Fae Beauty", "Embryolisse",
  "Rhode", "Staze Beauty", "Makeup By Mario", "D'alba",
]);

const BOLD_SANS = new Set([
  "NARS", "M·A·C", "YSL", "PIXI", "MARS", "OFRA",
  "Hourglass", "Dior", "Gucci", "Valentino", "Haus Labs",
  "Urban Decay", "Too Faced", "Smashbox", "PAC",
  "Maybelline", "Tarte", "Innisfree", "Biodence",
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
  const subtotal = productCharge + ARTIST_BASE + travel;
  const gst = subtotal * 0.05;
  const total = subtotal + gst;
  return { items, totalMRP, productCharge, travel, subtotal, gst, total };
}

// ─── LOOK SELECTOR ────────────────────────────────────────────────────────────
function LookSelector({ activeLook, onSelect }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ height: 1, flex: 1, background: "#E8E8E8" }} />
        <span style={{ fontSize: 9, letterSpacing: 4, color: "#AAAAAA", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif", whiteSpace: "nowrap" }}>
          Artist-curated occasions
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

        {(isSuggestion || brand.artist || brand.popular) && (
          <div style={{ marginTop: 2 }}>
            {(isSuggestion || brand.artist) && <span className="ae-tag" style={{ color: "#C8A96E" }}>✦ Artist's Suggestion</span>}
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
function ProductRow({ item, index, activeLook, selections, onSelect, isSmall }) {
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
              <h3 style={{ fontSize: 22, fontFamily: "'Playfair Display', Georgia, serif", color: "#0A0A0A", margin: 0, fontWeight: 400, letterSpacing: -0.3 }}>
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
        <div className="ae-brand-grid" style={{ gridTemplateColumns: isSmall ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))" }}>
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
  const navigate = useNavigate();
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

  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = vw < 1024;   // hide side panels, show mobile tabs/bar
  const isSmall = vw < 640;     // single-column brand list

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
      <div className="ae-root" style={{ minHeight: "100vh", background: "#FAFAFA", display: "flex", flexDirection: "column", paddingTop: isMobile ? 12 : 0 }}>
        <style>{FONTS}{STYLES}</style>

        {/* Header */}
        <div className="ae-topbar" style={{ background: "#0A0A0A", padding: isMobile ? "16px 18px" : "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: isMobile ? 6 : 0 }}>
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

          <p style={{ fontSize: 9, letterSpacing: 6, color: "#C8A96E", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 20, textAlign: "center" }}>
            Exclusive · Personal · Precise
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(40px, 9vw, 64px)", fontWeight: 400, color: "#0A0A0A", textAlign: "center", margin: "0 0 4px", lineHeight: 1.05, letterSpacing: -0.5 }}>
            Your makeup,
          </h1>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(40px, 9vw, 64px)", fontWeight: 400, fontStyle: "italic", color: "#0A0A0A", textAlign: "center", margin: "0 0 32px", lineHeight: 1.05, letterSpacing: -0.5 }}>
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
      <div className="ae-root" style={{ minHeight: "100vh", background: "#FAFAFA", paddingTop: isMobile ? 12 : 0 }}>
        <style>{FONTS}{STYLES}{`
          @keyframes ae-fadein { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes ae-linein { from { transform: scaleX(0); } to { transform: scaleX(1); } }
          .ae-price-card { animation: ae-fadein 0.72s cubic-bezier(0.22,1,0.36,1) both; }
          .ae-charge-row { display: flex; justify-content: space-between; align-items: flex-end; padding: 16px 0; border-bottom: 0.5px solid rgba(255,255,255,0.07); }
          .ae-charge-row:last-of-type { border-bottom: none; }
          .ae-gold-line { height: 0.5px; background: #C8A96E; transform-origin: left; animation: ae-linein 1s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
          .ae-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #FFFFFF; border: 0.5px solid #E8E8E8; border-radius: 2px; margin: 4px 4px 0 0; }
        `}</style>

        {/* Nav */}
        <div className="ae-topbar" style={{ background: "#0A0A0A", padding: isMobile ? "14px 16px" : "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: isMobile ? "relative" : "sticky", top: 0, zIndex: 50, borderRadius: isMobile ? 6 : 0 }}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, color: "#FFFFFF", letterSpacing: 3, fontWeight: 400 }}>AMOUR ESTILO</div>
          <button onClick={() => setPhase("curate")} style={{ background: "none", border: "0.5px solid #333", color: "#666", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", padding: "7px 14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", borderRadius: 2 }}>
            ← Edit
          </button>
        </div>

        <div style={{ maxWidth: 680, margin: "0 auto", padding: isMobile ? "28px 16px 80px" : "48px 24px 80px" }}>

          {/* Page header */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 8, letterSpacing: 6, color: "#C8A96E", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>
              Personalised for
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 700, color: "#0A0A0A", margin: "0 0 4px", letterSpacing: -0.5, lineHeight: 1.1 }}>
              {clientName}'s
            </h2>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 400, fontStyle: "italic", color: "#0A0A0A", margin: "0 0 10px", letterSpacing: -0.5, lineHeight: 1.1 }}>
              exclusive look
            </h2>
            {activeLook && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 1, background: "#C8A96E" }} />
                <span style={{ fontSize: 11, color: "#999", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>{activeLook.name}</span>
              </div>
            )}
          </div>

          {/* Compact brand selection — all categories inline */}
          <div style={{ marginBottom: 32 }}>
            {CATALOG.map(cat => {
              const done = cat.items.filter(it => selections[it.id]);
              if (!done.length) return null;
              return (
                <div key={cat.slug} style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 8, letterSpacing: 4, color: "#AAAAAA", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>
                    {cat.category}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
                    {done.map(item => {
                      const brand = selections[item.id];
                      const isSuggestion = activeLook?.id && brand.looks?.includes(activeLook.id);
                      const logo = getLogoLabel(brand.name);
                      return (
                        <div key={item.id} className="ae-chip">
                          <div style={{ fontSize: 8, color: "#CCCCCC", textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>
                            {item.type}
                          </div>
                          <div style={{ width: "0.5px", height: 10, background: "#E5E5E5" }} />
                          <div style={{ fontFamily: SERIF_ITALIC.has(logo) ? "'Cormorant Garamond', Georgia, serif" : "'DM Sans', sans-serif", fontSize: SERIF_ITALIC.has(logo) ? 13 : 11, fontStyle: SERIF_ITALIC.has(logo) ? "italic" : "normal", fontWeight: BOLD_SANS.has(logo) ? 700 : 500, letterSpacing: BOLD_SANS.has(logo) ? 1 : 0.3, color: "#0A0A0A" }}>
                            {logo}
                          </div>
                          {isSuggestion && <span style={{ fontSize: 9, color: "#C8A96E" }}>✦</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Travel distance */}
          <div style={{ padding: "18px 0", borderTop: "0.5px solid #EBEBEB", borderBottom: "0.5px solid #EBEBEB", marginBottom: 36 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <div style={{ fontSize: 8, letterSpacing: 4, color: "#AAAAAA", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
                Distance from MG Road, Bengaluru
              </div>
              <div style={{ fontFamily: "'Bodoni Moda', Georgia, serif", fontSize: 15, color: "#0A0A0A", fontWeight: 400, letterSpacing: 0.5 }}>{km} km</div>
            </div>
            <input type="range" min="0" max="50" step="1" value={km} onChange={e => setKm(Number(e.target.value))} className="ae-slider-light" />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 9, color: "#CCCCCC", fontFamily: "'DM Sans', sans-serif" }}>
              <span>0 km · Central</span><span>50 km</span>
            </div>
          </div>

          {/* Luxe pricing card */}
          <div className="ae-price-card" style={{ background: "#0C0C0C", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ padding: isMobile ? "28px 22px 20px" : "36px 32px 24px" }}>
              <div style={{ fontSize: 8, letterSpacing: 6, color: "#C8A96E", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 14 }}>
                Amour Estilo · Estimate
              </div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 4 }}>
                Your exclusive
              </div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 400, fontStyle: "italic", color: "#FFFFFF", lineHeight: 1.1 }}>
                curation estimate
              </div>
              <div className="ae-gold-line" style={{ marginTop: 26 }} />
            </div>

            <div style={{ padding: isMobile ? "0 22px 16px" : "0 32px 20px" }}>
              {[
                { label: "Products", sub: `20% of ${inr(p.totalMRP)} MRP${p.totalMRP * 0.2 > PRODUCT_CAP ? " · capped" : ""}`, val: p.productCharge },
                { label: "Artist Fee", sub: "Guaranteed minimum", val: ARTIST_BASE },
                { label: "Travel", sub: `${km} km from MG Road`, val: p.travel },
                { label: "GST", sub: "5% on services", val: p.gst },
              ].map(row => (
                <div key={row.label} className="ae-charge-row">
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: 3, color: "#555", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 3 }}>{row.label}</div>
                    <div style={{ fontSize: 11, color: "#3A3A3A", fontFamily: "'DM Sans', sans-serif" }}>{row.sub}</div>
                  </div>
                  <div style={{ fontFamily: "'Bodoni Moda', Georgia, serif", fontSize: 16, fontWeight: 400, color: "#AAAAAA", letterSpacing: 0.5 }}>{inr(row.val)}</div>
                </div>
              ))}
            </div>

            <div style={{ margin: isMobile ? "0 22px" : "0 32px", height: "0.5px", background: "#C8A96E", opacity: 0.4 }} />
            <div style={{ padding: isMobile ? "20px 22px 28px" : "24px 32px 36px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: 8, letterSpacing: 5, color: "#C8A96E", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 5 }}>Total</div>
                <div style={{ fontSize: 11, color: "#3A3A3A", fontFamily: "'DM Sans', sans-serif" }}>All inclusive</div>
              </div>
              <div style={{ fontFamily: "'Bodoni Moda', Georgia, serif", fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 600, color: "#FFFFFF", letterSpacing: 0.5, lineHeight: 1 }}>
                {inr(p.total)}
              </div>
            </div>

            <div style={{ padding: isMobile ? "12px 22px 22px" : "12px 32px 24px", borderTop: "0.5px solid rgba(255,255,255,0.04)" }}>
              <p style={{ fontSize: 10, color: "#2E2E2E", lineHeight: 1.9, fontFamily: "'DM Sans', sans-serif", margin: 0, letterSpacing: 0.2 }}>
                Final quote confirmed at booking · Artist minimum ₹7,500 · Product cap ₹25,000
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/AmourAppointmentBooking", {
                state: {
                  clientName,
                  activeLook: activeLook?.id,
                  selections,
                  km,
                  total: p.total,
                },
              })}
              style={{ flex: 2, minWidth: 180, padding: "16px", background: "#0A0A0A", color: "#FFFFFF", border: "none", borderRadius: 3, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
            >
              Book this look
            </button>
            <button onClick={() => {
              const sel = {};
              CATALOG.forEach(cat => cat.items.forEach(item => {
                const pick = item.brands.find(b => b.looks?.includes(LOOKS[0].id));
                if (pick) sel[item.id] = pick;
              }));
              setSelections(sel); setActiveLook(LOOKS[0]); setPhase("intro"); setClientName("");
            }} style={{ flex: 1, minWidth: 140, padding: "16px", background: "transparent", color: "#0A0A0A", border: "1px solid #E0E0E0", borderRadius: 3, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Start over
            </button>
          </div>

          {/* Product pricing notes */}
          <div style={{ marginTop: 40, paddingTop: 32, borderTop: "0.5px solid #EBEBEB" }}>
            <div style={{ fontSize: 8, letterSpacing: 5, color: "#C8A96E", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>
              How product pricing works
            </div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 400, color: "#0A0A0A", marginBottom: 16, lineHeight: 1.2 }}>
              You pay for what is<br /><span style={{ fontStyle: "italic" }}>actually used on you.</span>
            </div>
            {[
              {
                heading: "MRP is the full retail price",
                body: "The MRP shown beside each brand is the standard retail price of the full-sized product. You are not charged the full MRP."
              },
              {
                heading: "You are charged 20% of MRP",
                body: "This represents the estimated quantity of product used during your session — typically a professional application uses 15–25% of a full unit. We standardise this at 20% for transparency."
              },
              {
                heading: "Product contribution is capped",
                body: "No matter how many products are selected, the total product contribution to your estimate is capped at ₹25,000. Extensive kit usage beyond this threshold is absorbed by the artist."
              },
              {
                heading: "Products are sourced fresh for you",
                body: "All products are purchased or reserved specifically for your appointment. We do not use shared kits across clients. Unused product from your session is yours to take home."
              },
              {
                heading: "MRP may vary by retailer",
                body: "MRPs listed are indicative, sourced from brand websites and authorised Indian retailers. Actual purchase price may vary slightly. Final pricing is confirmed at the time of booking."
              },
            ].map(({ heading, body }) => (
              <div key={heading} style={{ display: "flex", gap: 14, paddingBottom: 16, marginBottom: 16, borderBottom: "0.5px solid #F0F0F0" }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#C8A96E", flexShrink: 0, marginTop: 6 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A", fontFamily: "'DM Sans', sans-serif", marginBottom: 3 }}>{heading}</div>
                  <div style={{ fontSize: 11, color: "#888", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.75 }}>{body}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Terms & Conditions */}
          <div style={{ marginTop: 32, padding: "24px 20px", background: "#F7F5F2", borderRadius: 3 }}>
            <div style={{ fontSize: 8, letterSpacing: 5, color: "#C8A96E", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>
              Terms & Conditions — Estimate
            </div>
            {[
              "This estimate is generated based on your product selections and distance input. It is indicative only and does not constitute a final invoice or booking confirmation.",
              "The product cost contribution is calculated at 20% of the listed MRP per product, subject to a maximum cap of ₹25,000 across all products selected.",
              "The artist fee listed (₹7,500 minimum) is the guaranteed base charge. The final artist fee may be higher depending on event type, duration, number of looks, or trial sessions booked.",
              "Travel charges are calculated from MG Road, Bengaluru. Actual distance will be confirmed at booking based on the verified venue address. Toll, parking, and intercity travel are charged separately where applicable.",
              "GST at 5% is levied on the total of product cost, artist fee, and travel charge as per applicable Indian tax regulations for professional beauty services.",
              "All MRPs listed are sourced from official brand channels and authorised Indian retailers as of the date of listing. Amour Estilo is not responsible for price changes at retail level.",
              "Product availability is subject to stock. If a selected product is unavailable at the time of your appointment, the artist will substitute with a product of equal or superior quality and notify you in advance.",
              "Products are purchased or reserved exclusively for each client's session. Unused product remains the property of the client and will be handed over post-appointment.",
              "This estimate is valid for 7 days from the date of generation. Pricing may be revised after this period or in the event of a change in location, date, or service scope.",
              "By proceeding to book, you confirm that you have read and understood these terms. Final T&C, cancellation and rescheduling policies will be provided in your booking confirmation.",
            ].map((clause, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: "#C8A96E", fontFamily: "'Bodoni Moda', Georgia, serif", flexShrink: 0, marginTop: 1, minWidth: 14 }}>{i + 1}.</div>
                <div style={{ fontSize: 10, color: "#777", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.8 }}>{clause}</div>
              </div>
            ))}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "0.5px solid #E8E4DE", fontSize: 10, color: "#AAAAAA", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>
              Amour Estilo · Bengaluru · amourestilo.com · All rights reserved.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── CURATION ──
  return (
    <div className="ae-root" style={{ minHeight: "100vh", background: "#FAFAFA", paddingTop: isMobile ? 12 : 0 }}>
      <style>{FONTS}{STYLES}</style>

      {/* Sticky header */}
      <div className="ae-topbar" style={{ background: "#0A0A0A", padding: isMobile ? "12px 16px" : "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: isMobile ? "relative" : "sticky", top: 0, zIndex: 100, gap: isMobile ? 8 : 16, borderRadius: isMobile ? 6 : 0 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: isMobile ? 14 : 17, color: "#FFFFFF", letterSpacing: isMobile ? 2 : 5, flexShrink: 0, whiteSpace: "nowrap" }}>AMOUR ESTILO</div>
        {activeLook && !isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            <span style={{ fontSize: 8, letterSpacing: 2, color: "#C8A96E", textTransform: "uppercase", fontFamily: "DM Sans, sans-serif" }}>Look:</span>
            <span style={{ fontSize: 11, color: "#888", fontFamily: "DM Sans, sans-serif" }}>{activeLook.name}</span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 16, flexShrink: 0 }}>
          {!isMobile && <EstimatePanel selections={selections} compact={true} />}
          <button
            onClick={() => setPhase("summary")}
            disabled={totalSelected === 0}
            style={{
              background: totalSelected > 0 ? "#C8A96E" : "#1E1E1E",
              color: totalSelected > 0 ? "#0A0A0A" : "#444",
              border: "none",
              padding: isMobile ? "8px 12px" : "9px 18px",
              fontSize: 9,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: totalSelected > 0 ? "pointer" : "default",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 600,
              borderRadius: 2,
              flexShrink: 0,
              whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
          >
            {isMobile ? "Estimate →" : "View estimate →"}
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="ae-main">

        {/* Left sidebar — desktop only */}
        {!isMobile && (
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
        )}

        {/* Content area */}
        <div className="ae-content" style={{ flex: 1, minWidth: 0, padding: isMobile ? "16px 16px 100px" : "28px 28px 60px" }}>
          {/* Mobile category tabs */}
          {isMobile && <StepNav steps={CATALOG} active={activeStep} onSelect={setActiveStep} selections={selections} />}

          {/* Look picker — shown on first step */}
          {activeStep === 0 && (
            <div style={{ marginBottom: 8 }}>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, color: "#0A0A0A", fontWeight: 700, margin: "0 0 6px", letterSpacing: -0.5 }}>
                Choose your look
              </h2>
              <p style={{ fontSize: 12, color: "#999", fontFamily: "'DM Sans', sans-serif", margin: "0 0 24px", lineHeight: 1.7 }}>
                Tell us the occasion — our artist pre-selects the best brands for it. Every choice is yours to keep or swap.
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
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, color: "#0A0A0A", margin: "2px 0 0", letterSpacing: -0.5 }}>
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
              isSmall={isSmall}
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
        {!isMobile && (
        <div className="ae-side-right">
          <EstimatePanel selections={selections} compact={false} />
        </div>
        )}
      </div>

      {/* Mobile bottom bar */}
      {isMobile && (
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0A0A0A", borderTop: "0.5px solid #1A1A1A", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 99, boxSizing: "border-box" }}>
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
      )}
    </div>
  );
}