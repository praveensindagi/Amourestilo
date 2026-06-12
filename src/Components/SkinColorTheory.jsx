import { useState, useRef, useEffect, useCallback } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  black: "#0A0A0A",
  white: "#FAFAFA",
  offwhite: "#F4F2EF",
  grey100: "#F0EEED",
  grey200: "#E2DFDC",
  grey400: "#B8B4AF",
  grey600: "#6B6762",
  grey800: "#2C2A28",
  gold: "#C9A96E",
  goldLight: "#E8D5A3",
  goldDark: "#9B7D45",
};

// ─── SKIN TONE DATABASE (L*a*b* informed) ────────────────────────────────────
const SKIN_TONES = [
  { id: "ST01", name: "Porcelain", hex: "#FAE8DC", depth: "light", undertone: "cool", chroma: "soft", munsell: { L: 88, a: 6, b: 12 } },
  { id: "ST02", name: "Ivory", hex: "#F5D5B2", depth: "light", undertone: "warm", chroma: "clear", munsell: { L: 85, a: 8, b: 22 } },
  { id: "ST03", name: "Cream", hex: "#EEC99A", depth: "light", undertone: "warm", chroma: "clear", munsell: { L: 80, a: 10, b: 28 } },
  { id: "ST04", name: "Sand", hex: "#E0B580", depth: "medium", undertone: "warm", chroma: "soft", munsell: { L: 74, a: 12, b: 30 } },
  { id: "ST05", name: "Bisque", hex: "#D4A06A", depth: "medium", undertone: "warm", chroma: "soft", munsell: { L: 68, a: 14, b: 32 } },
  { id: "ST06", name: "Honey", hex: "#C78A50", depth: "medium", undertone: "warm", chroma: "clear", munsell: { L: 60, a: 16, b: 34 } },
  { id: "ST07", name: "Caramel", hex: "#B07238", depth: "medium", undertone: "warm", chroma: "clear", munsell: { L: 52, a: 16, b: 30 } },
  { id: "ST08", name: "Sienna", hex: "#955A28", depth: "deep", undertone: "warm", chroma: "clear", munsell: { L: 42, a: 18, b: 26 } },
  { id: "ST09", name: "Chestnut", hex: "#7A4420", depth: "deep", undertone: "warm", chroma: "soft", munsell: { L: 35, a: 16, b: 22 } },
  { id: "ST10", name: "Espresso", hex: "#5E3018", depth: "deep", undertone: "cool", chroma: "clear", munsell: { L: 26, a: 12, b: 16 } },
  { id: "ST11", name: "Ebony", hex: "#3E1E0A", depth: "deep", undertone: "cool", chroma: "soft", munsell: { L: 18, a: 8, b: 10 } },
  { id: "ST12", name: "Rose Beige", hex: "#E8C4B0", depth: "light", undertone: "cool", chroma: "soft", munsell: { L: 80, a: 14, b: 16 } },
  { id: "ST13", name: "Peachy", hex: "#E0A888", depth: "light", undertone: "warm", chroma: "clear", munsell: { L: 74, a: 18, b: 24 } },
  { id: "ST14", name: "Olive", hex: "#A88858", depth: "medium", undertone: "olive", chroma: "soft", munsell: { L: 58, a: 8, b: 26 } },
  { id: "ST15", name: "Bronze", hex: "#8A5C30", depth: "medium", undertone: "warm", chroma: "clear", munsell: { L: 44, a: 16, b: 28 } },
  { id: "ST16", name: "Mahogany", hex: "#4A2010", depth: "deep", undertone: "cool", chroma: "clear", munsell: { L: 22, a: 14, b: 12 } },
];

// ─── 12-SEASON COLOUR SYSTEM ─────────────────────────────────────────────────
const SEASONS = {
  "Light Spring": {
    group: "Spring", icon: "✦",
    description: "Delicate warmth — your palette mirrors morning sunlight on pale petals. Clear, warm, and light.",
    wears: ["#F9E4B7","#F5C87A","#F0A060","#E8D4B0","#C8E8A0","#A8D4C0","#F8D0C0","#E0B890"],
    wearNames: ["Warm Ivory","Golden Peach","Apricot","Champagne","Light Pistachio","Soft Mint","Blush","Honey"],
    avoids: ["#2C2C5A","#800020","#1A3A2A","#4A0040"],
    avoidNames: ["Navy","Burgundy","Forest","Plum"],
    neutrals: { best: "#F5E8D0", worst: "#808080", metal: "Gold", white: "Warm Ivory #F9F2E3" },
    makeup: { lip: "#E87060", eye: "#C8906A", blush: "#F0A080", brow: "Warm Taupe" },
    contrast: "low",
  },
  "True Spring": {
    group: "Spring", icon: "✦",
    description: "Golden clarity — warm, vivid, and fresh. Your complexion glows in the colours of a full bloom.",
    wears: ["#F5C040","#F08040","#E85028","#80C840","#40B890","#F8E080","#F0A040","#C0E060"],
    wearNames: ["Warm Gold","Pumpkin","Tomato Red","Yellow-Green","Teal","Buttercup","Tangerine","Lime"],
    avoids: ["#000080","#800040","#4A4A6A","#D0D0D8"],
    avoidNames: ["Royal Blue","Maroon","Cool Purple","Icy Grey"],
    neutrals: { best: "#F0D890", worst: "#C0C0C8", metal: "Yellow Gold", white: "Cream #FFF8E8" },
    makeup: { lip: "#E05030", eye: "#C07040", blush: "#F09060", brow: "Golden Brown" },
    contrast: "medium",
  },
  "Bright Spring": {
    group: "Spring", icon: "✦",
    description: "Vivid warmth with high contrast — the most electric of the springs. You need intensity and clarity.",
    wears: ["#FF4500","#FF8C00","#FFD700","#00CED1","#FF1493","#32CD32","#FF6347","#00FA9A"],
    wearNames: ["Red-Orange","Dark Orange","Golden Yellow","Dark Turquoise","Deep Pink","Lime Green","Tomato","Spring Green"],
    avoids: ["#A0A090","#807878","#506050","#604848"],
    avoidNames: ["Taupe","Muddy Rose","Muted Green","Dusty Mauve"],
    neutrals: { best: "#F8F0D0", worst: "#B0A8A0", metal: "Bright Gold", white: "Pure White #FFFFFF" },
    makeup: { lip: "#FF4060", eye: "#FF8040", blush: "#FF7060", brow: "Warm Brown" },
    contrast: "high",
  },
  "Light Summer": {
    group: "Summer", icon: "◇",
    description: "Whisper-cool softness — your palette is the haze of an overcast summer morning. Muted, cool, and delicate.",
    wears: ["#C8D8E8","#B8C8D8","#D8C0D8","#C0D0C8","#E0C8D8","#A8C0D0","#D8D0E0","#B0C8C0"],
    wearNames: ["Powder Blue","Light Blue-Grey","Soft Lavender","Cool Sage","Blush Mauve","Cadet Blue","Thistle","Soft Teal"],
    avoids: ["#FF6600","#FFD700","#8B4513","#228B22"],
    avoidNames: ["Orange","Bright Gold","Saddle Brown","Forest Green"],
    neutrals: { best: "#E8E4EC", worst: "#C8A870", metal: "Silver", white: "Soft White #F0EEF8" },
    makeup: { lip: "#C07888","eye":"#8898B8","blush":"#D09090","brow":"Ash Taupe" },
    contrast: "low",
  },
  "True Summer": {
    group: "Summer", icon: "◇",
    description: "Dusty rose coolness — your world is faded silk, rose water, and soft afternoon shade.",
    wears: ["#C08098","#8898B8","#98B0A8","#B898C0","#7890A0","#D0A8B8","#A0A8C0","#90B0A0"],
    wearNames: ["Dusty Rose","Cool Blue","Sage Green","Soft Violet","Antique Blue","Mauve","Periwinkle","Sea Green"],
    avoids: ["#FF8C00","#FF4500","#DAA520","#8B4513"],
    avoidNames: ["Dark Orange","Orange-Red","Goldenrod","Brown"],
    neutrals: { best: "#D8D0DC", worst: "#C8A060", metal: "Silver/Rose Gold", white: "Rose White #FFF0F4" },
    makeup: { lip: "#B86878","eye":"#7888A8","blush":"#C08888","brow":"Cool Brown" },
    contrast: "medium",
  },
  "Soft Summer": {
    group: "Summer", icon: "◇",
    description: "The most muted of all seasons — grey-kissed cool tones that ask for the softest, most understated palette.",
    wears: ["#A8B0B8","#B0A8B0","#98A8A0","#B8B0C0","#A0B0A8","#C0B8C8","#909898","#A8A0A8"],
    wearNames: ["Blue-Grey","Mauve-Grey","Cool Sage","Soft Purple-Grey","Greyish Teal","Dusty Lavender","Steel","Greyish Mauve"],
    avoids: ["#FF0000","#FF8C00","#000000","#FFD700"],
    avoidNames: ["Pure Red","Orange","Jet Black","Bright Yellow"],
    neutrals: { best: "#C8C4C8", worst: "#D4A050", metal: "Pewter/Silver", white: "Soft Grey-White #EEECEE" },
    makeup: { lip: "#A87080","eye":"#708090","blush":"#B89090","brow":"Soft Ash" },
    contrast: "low",
  },
  "Soft Autumn": {
    group: "Autumn", icon: "◈",
    description: "Warm earth in watercolour — muted golds, dusty olives, and soft terracottas that feel like late September light.",
    wears: ["#C8A870","#A09060","#B08858","#90A070","#C09870","#887858","#A88050","#80906A"],
    wearNames: ["Warm Tan","Khaki","Camel","Moss","Wheat","Warm Brown","Bronze","Sage-Olive"],
    avoids: ["#000080","#FF1493","#00FFFF","#8A2BE2"],
    avoidNames: ["Navy","Hot Pink","Cyan","Blue-Violet"],
    neutrals: { best: "#C8B890", worst: "#8080A0", metal: "Antique Gold", white: "Oyster #F5EDD8" },
    makeup: { lip: "#B87860","eye":"#907050","blush":"#C09070","brow":"Warm Taupe" },
    contrast: "low",
  },
  "True Autumn": {
    group: "Autumn", icon: "◈",
    description: "Rich harvest abundance — deep golds, burnt orange, forest green, and chocolate. Nature at its most generous.",
    wears: ["#C87820","#A05020","#806030","#587840","#904020","#D09030","#705030","#488050"],
    wearNames: ["Burnt Gold","Rust","Warm Brown","Olive Green","Terracotta","Mustard","Chocolate","Forest"],
    avoids: ["#FF69B4","#87CEEB","#E0E0E8","#D0D0FF"],
    avoidNames: ["Hot Pink","Sky Blue","Ice Grey","Lavender Ice"],
    neutrals: { best: "#B89860", worst: "#B0B8C8", metal: "Bronze/Gold", white: "Warm Cream #FFF0DC" },
    makeup: { lip: "#C06840","eye":"#907040","blush":"#C08060","brow":"Warm Auburn" },
    contrast: "medium",
  },
  "Deep Autumn": {
    group: "Autumn", icon: "◈",
    description: "Dark forest floor — the deepest warm season. Richest browns, deepest rusts, dark olive. Commanding depth.",
    wears: ["#6A3810","#8A5020","#405830","#7A3020","#502800","#304820","#704020","#A06028"],
    wearNames: ["Dark Brown","Burnt Sienna","Dark Olive","Deep Rust","Espresso","Hunter Green","Auburn","Rich Camel"],
    avoids: ["#E0F0FF","#FFE0F0","#E0E8E0","#F0F0FF"],
    avoidNames: ["Icy Blue","Icy Pink","Icy Mint","Icy Lavender"],
    neutrals: { best: "#805830", worst: "#C0D0E0", metal: "Dark Bronze", white: "Dark Ivory #F0E0C8" },
    makeup: { lip: "#A04828","eye":"#805030","blush":"#A06040","brow":"Dark Auburn" },
    contrast: "high",
  },
  "Deep Winter": {
    group: "Winter", icon: "◆",
    description: "Midnight intensity — the darkest cool season. Jet black, true white, deep jewel tones. Striking by design.",
    wears: ["#1A1A3A","#8B0000","#004080","#006040","#400040","#000080","#006080","#400020"],
    wearNames: ["Dark Navy","Deep Red","Royal Blue","Emerald","Deep Purple","Midnight Blue","Dark Teal","Deep Wine"],
    avoids: ["#C8A870","#E0C890","#A09070","#C0B090"],
    avoidNames: ["Camel","Warm Tan","Khaki","Oyster"],
    neutrals: { best: "#1A1A1A", worst: "#C0A870", metal: "Platinum/Silver", white: "Pure White #FFFFFF" },
    makeup: { lip: "#8B0020","eye":"#202060","blush":"#901030","brow":"Cool Black-Brown" },
    contrast: "high",
  },
  "True Winter": {
    group: "Winter", icon: "◆",
    description: "Arctic jewels — clear, cool, vivid. The purest expression of winter. White, black, and saturated jewel tones.",
    wears: ["#0000CD","#DC143C","#006400","#800080","#00CED1","#FF1493","#4169E1","#008080"],
    wearNames: ["Royal Blue","Crimson","Dark Green","Purple","Turquoise","Deep Pink","Royal Blue","Teal"],
    avoids: ["#C87820","#D4A050","#A08050","#C09050"],
    avoidNames: ["Burnt Gold","Warm Camel","Warm Khaki","Warm Tan"],
    neutrals: { best: "#000000", worst: "#C8A060", metal: "Silver", white: "True White #FFFFFF" },
    makeup: { lip: "#CC0020","eye":"#000040","blush":"#CC2040","brow":"Cool Dark Brown" },
    contrast: "high",
  },
  "Bright Winter": {
    group: "Winter", icon: "◆",
    description: "Electric cool — high contrast, vivid and clear like Winter, but with the brightness of Spring. Electrifying.",
    wears: ["#FF0050","#0050FF","#00FF80","#FF00FF","#00CCFF","#FF4080","#8000FF","#00FF40"],
    wearNames: ["Bright Red-Pink","Electric Blue","Vivid Green","Magenta","Bright Cyan","Hot Pink","Vivid Violet","Bright Lime"],
    avoids: ["#A08870","#C0A880","#806040","#A09070"],
    avoidNames: ["Warm Beige","Warm Tan","Warm Brown","Warm Khaki"],
    neutrals: { best: "#0A0A0A", worst: "#B09870", metal: "Bright Silver", white: "Brilliant White #FFFFFF" },
    makeup: { lip: "#FF0040","eye":"#0040C0","blush":"#FF2050","brow":"Cool Dark" },
    contrast: "high",
  },
};

// ─── SEASON CLASSIFIER ───────────────────────────────────────────────────────
function classifySeason(tone) {
  const { depth, undertone, chroma } = tone;
  if (depth === "light" && undertone === "warm" && chroma === "clear") return "True Spring";
  if (depth === "light" && undertone === "warm" && chroma === "soft") return "Light Spring";
  if (depth === "medium" && undertone === "warm" && chroma === "clear") return "True Spring";
  if (depth === "light" && undertone === "cool" && chroma === "soft") return "Light Summer";
  if (depth === "light" && undertone === "cool" && chroma === "clear") return "Bright Spring";
  if (depth === "medium" && undertone === "cool" && chroma === "soft") return "Soft Summer";
  if (depth === "medium" && undertone === "cool" && chroma === "clear") return "True Summer";
  if (depth === "medium" && undertone === "olive" && chroma === "soft") return "Soft Autumn";
  if (depth === "medium" && undertone === "warm" && chroma === "soft") return "Soft Autumn";
  if (depth === "deep" && undertone === "warm" && chroma === "clear") return "Deep Autumn";
  if (depth === "deep" && undertone === "warm" && chroma === "soft") return "True Autumn";
  if (depth === "deep" && undertone === "cool" && chroma === "soft") return "True Winter";
  if (depth === "deep" && undertone === "cool" && chroma === "clear") return "Deep Winter";
  return "True Autumn";
}

// ─── OUTFIT PAIRINGS ─────────────────────────────────────────────────────────
const OUTFIT_PAIRINGS = {
  Spring: [
    { name: "Golden Hour", occasion: "Day", top: "#F5C040", bottom: "#F0D890", accent: "#E07830", desc: "Warm gold + cream + terracotta" },
    { name: "Coral Garden", occasion: "Casual", top: "#F08060", bottom: "#F5E8D0", accent: "#C8A870", desc: "Coral + ivory + warm tan" },
    { name: "Spring Meadow", occasion: "Weekend", top: "#A0C870", bottom: "#F0D890", accent: "#E0A850", desc: "Yellow-green + warm ivory + gold" },
    { name: "Peach Blossom", occasion: "Evening", top: "#E8A080", bottom: "#C8904A", accent: "#F5D8B0", desc: "Peach + caramel + champagne" },
  ],
  Summer: [
    { name: "Rose Dusk", occasion: "Evening", top: "#C08098", bottom: "#E8D0D8", accent: "#8898B8", desc: "Dusty rose + blush + soft periwinkle" },
    { name: "Coastal Grey", occasion: "Day", top: "#8898B8", bottom: "#D8D0E0", accent: "#A8B8B0", desc: "Cool blue + lavender grey + sage" },
    { name: "Lavender Mist", occasion: "Casual", top: "#C0A8D0", bottom: "#E0D8E8", accent: "#98A8B8", desc: "Soft violet + pale lilac + blue-grey" },
    { name: "Silver Screen", occasion: "Formal", top: "#A0A8B8", bottom: "#2A2A38", accent: "#C8C0D0", desc: "Periwinkle + near-black + soft lavender" },
  ],
  Autumn: [
    { name: "Harvest Table", occasion: "Day", top: "#C87820", bottom: "#6A3810", accent: "#D09030", desc: "Rust + chocolate + mustard" },
    { name: "Forest Floor", occasion: "Casual", top: "#587840", bottom: "#402810", accent: "#A09060", desc: "Olive + dark brown + warm khaki" },
    { name: "Ember Night", occasion: "Evening", top: "#8B2010", bottom: "#3A1808", accent: "#C87820", desc: "Deep rust + espresso + burnt gold" },
    { name: "Spice Market", occasion: "Weekend", top: "#B06030","bottom":"#504020","accent":"#C08040", desc: "Warm sienna + dark brown + camel" },
  ],
  Winter: [
    { name: "Midnight Edit", occasion: "Evening", top: "#0A0A14", bottom: "#1A1A2A", accent: "#DC143C", desc: "Jet black + deep navy + true crimson" },
    { name: "Jewel Box", occasion: "Formal", top: "#800080", bottom: "#000080", accent: "#F5F5F5", desc: "Deep purple + royal navy + pure white" },
    { name: "Monochrome", occasion: "Day", top: "#F5F5F5", bottom: "#0A0A0A", accent: "#404040", desc: "Pure white + jet black + charcoal" },
    { name: "Arctic Gem", occasion: "Casual", top: "#006080", bottom: "#0A0A0A", accent: "#00CED1", desc: "Dark teal + black + bright turquoise" },
  ],
};

// ─── FACE SHAPES ─────────────────────────────────────────────────────────────
const FACE_SHAPES = [
  {
    id: "oval", name: "Oval",
    ratios: "Length 1.5× width · gentle jaw curve",
    styling: ["V-necks and scoop necks both work","Balanced earring proportions","Almost any collar style","Avoid nothing — most versatile shape"],
    necklines: ["V-neck","Scoop","Boat","Cowl"],
    earrings: ["Any shape","Any length"],
  },
  {
    id: "round", name: "Round",
    ratios: "Equal width and length · full cheeks · soft jaw",
    styling: ["V-necks create vertical direction","Long pendant earrings add length","Angular earring shapes add structure","Avoid round collars and chokers"],
    necklines: ["V-neck","Deep V","Plunge","Asymmetric"],
    earrings: ["Long drops","Angular","Geometric"],
  },
  {
    id: "square", name: "Square",
    ratios: "Strong jaw · equal width throughout · high forehead",
    styling: ["Cowl and draped necklines soften angles","Oval hoop earrings contrast jaw","Off-shoulder adds horizontal softness","Avoid structured square collars"],
    necklines: ["Cowl","Off-shoulder","Round","Asymmetric"],
    earrings: ["Round hoops","Oval drops","Soft curves"],
  },
  {
    id: "heart", name: "Heart",
    ratios: "Wide forehead · narrowing to pointed chin",
    styling: ["Boat necks widen the lower face","Drop earrings wider at base balance","Wide-collar shirts add jaw presence","Avoid ruffled or pussy-bow necklines"],
    necklines: ["Boat neck","Off-shoulder","Sweetheart","Square"],
    earrings: ["Triangle drops","Fan shapes","Wider at base"],
  },
  {
    id: "diamond", name: "Diamond",
    ratios: "Narrow forehead · wide cheekbones · narrow jaw",
    styling: ["Wide collars add forehead presence","Chandelier earrings are stunning","Detailed necklines add interest below","Avoid very narrow V-necks"],
    necklines: ["Wide collar","Boat neck","Jewel neck","Off-shoulder"],
    earrings: ["Chandeliers","Studs","Wide drops"],
  },
  {
    id: "oblong", name: "Oblong",
    ratios: "Long and narrow · similar widths throughout",
    styling: ["Crew necks and turtlenecks add width","Wide hoop earrings balance length","Horizontal details reduce length","Avoid long pendant necklaces"],
    necklines: ["Crew neck","Turtleneck","Boat neck","Square"],
    earrings: ["Wide hoops","Button studs","Horizontal drops"],
  },
];

// ─── SVG FACE SHAPES ─────────────────────────────────────────────────────────
const FaceSVG = ({ id, active }) => {
  const stroke = active ? T.gold : T.grey400;
  const fill = active ? "#F5F0E8" : T.grey100;
  const shapes = {
    oval: <ellipse cx="32" cy="38" rx="20" ry="28" fill={fill} stroke={stroke} strokeWidth="1.5"/>,
    round: <circle cx="32" cy="38" r="22" fill={fill} stroke={stroke} strokeWidth="1.5"/>,
    square: <rect x="10" y="10" width="44" height="54" rx="5" fill={fill} stroke={stroke} strokeWidth="1.5"/>,
    heart: <path d="M32 62 C8 44 6 12 32 22 C58 12 56 44 32 62Z" fill={fill} stroke={stroke} strokeWidth="1.5"/>,
    diamond: <polygon points="32,6 56,38 32,68 8,38" fill={fill} stroke={stroke} strokeWidth="1.5"/>,
    oblong: <ellipse cx="32" cy="38" rx="16" ry="30" fill={fill} stroke={stroke} strokeWidth="1.5"/>,
  };
  return (
    <svg width="64" height="76" viewBox="0 0 64 76" fill="none">
      {shapes[id]}
    </svg>
  );
};

// ─── COLOUR SWATCH ───────────────────────────────────────────────────────────
const Swatch = ({ hex, name, size = "md", showName = false, selected = false, onClick }) => {
  const sizes = { sm: 28, md: 40, lg: 52 };
  const s = sizes[size];
  return (
    <div
      onClick={onClick}
      title={name}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div style={{
        width: s, height: s, borderRadius: "50%",
        background: hex,
        border: selected ? `2px solid ${T.gold}` : `1.5px solid rgba(0,0,0,0.08)`,
        boxShadow: selected ? `0 0 0 3px ${T.goldLight}40` : "none",
        transition: "all 0.2s",
        transform: selected ? "scale(1.1)" : "scale(1)",
      }} />
      {showName && (
        <span style={{ fontSize: 10, color: T.grey600, textAlign: "center", lineHeight: 1.2, maxWidth: s + 16 }}>{name}</span>
      )}
    </div>
  );
};

// ─── LABEL ───────────────────────────────────────────────────────────────────
const Label = ({ children, style = {} }) => (
  <span style={{
    fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
    color: T.grey400, fontWeight: 500, ...style,
  }}>{children}</span>
);

// ─── DIVIDER ─────────────────────────────────────────────────────────────────
const Divider = ({ style = {} }) => (
  <div style={{ height: 1, background: T.grey200, ...style }} />
);

// ─── GOLD TAG ────────────────────────────────────────────────────────────────
const GoldTag = ({ children }) => (
  <span style={{
    display: "inline-block", padding: "3px 10px",
    background: `${T.gold}15`, border: `0.5px solid ${T.gold}60`,
    borderRadius: 2, fontSize: 10, letterSpacing: "0.12em",
    textTransform: "uppercase", color: T.goldDark, fontWeight: 500,
  }}>{children}</span>
);

// ─── SEASON GROUP BADGE ───────────────────────────────────────────────────────
const GroupColors = { Spring: "#E8C060", Summer: "#8098B8", Autumn: "#B07030", Winter: "#404060" };
const GroupBadge = ({ group }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
    color: GroupColors[group] || T.grey600, fontWeight: 600,
  }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: GroupColors[group] || T.grey400, display: "inline-block" }} />
    {group}
  </span>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SkinColorTheory() {
  const [step, setStep] = useState("tone"); // tone | result
  const [selectedTone, setSelectedTone] = useState(null);
  const [selectedUndertone, setSelectedUndertone] = useState(null);
  const [selectedFace, setSelectedFace] = useState(null);
  const [activeTab, setActiveTab] = useState("palette");
  const [activeOutfit, setActiveOutfit] = useState(0);
  const [seasonData, setSeasonData] = useState(null);
  const [hoveredSwatch, setHoveredSwatch] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analysing, setAnalysing] = useState(false);
  const fileRef = useRef();
  const resultRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const handleAnalyse = () => {
    if (!selectedTone) return;
    setAnalysing(true);
    setTimeout(() => {
      const season = classifySeason(selectedTone);
      setSeasonData({ season, data: SEASONS[season] });
      setAnalysing(false);
      setStep("result");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }, 1200);
  };

  const season = seasonData?.data;
  const outfitGroup = season ? OUTFIT_PAIRINGS[seasonData.data ? Object.keys(SEASONS).find(k => k === seasonData.season)?.includes("Spring") ? "Spring" : Object.keys(SEASONS).find(k => k === seasonData.season)?.includes("Summer") ? "Summer" : Object.keys(SEASONS).find(k => k === seasonData.season)?.includes("Autumn") ? "Autumn" : "Winter" : "Spring"] : null;
  const outfits = season ? OUTFIT_PAIRINGS[season.group] : [];

  // font import
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  const serif = "'Cormorant Garamond', Georgia, serif";
  const sans = "'Inter', system-ui, sans-serif";

  return (
    <div style={{ background: T.white, minHeight: "100vh", fontFamily: sans, color: T.black }}>

      {/* ── HEADER ── */}
      <header style={{
        borderBottom: `1px solid ${T.grey200}`,
        padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64, position: "sticky", top: 0, background: T.white, zIndex: 100,
      }}>
        <div>
         
          <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: T.grey400, marginTop: 2 }}>
            Colour · Form · Identity
          </div>
        </div>
       
      </header>

      {/* ── HERO ── */}
      <section style={{
        padding: "80px 32px 64px",
        maxWidth: 720, margin: "0 auto",
        textAlign: "center",
      }}>
        <GoldTag>12-Season Colour Analysis</GoldTag>
        <h1 style={{
          fontFamily: serif, fontSize: "clamp(40px, 6vw, 68px)",
          fontWeight: 300, lineHeight: 1.12, marginTop: 20, marginBottom: 16,
          color: T.black, letterSpacing: "-0.01em",
        }}>
          Your skin.<br />
          <span style={{ fontStyle: "italic", color: T.gold }}>Your palette.</span>
        </h1>
        <p style={{
          fontSize: 15, lineHeight: 1.8, color: T.grey600, maxWidth: 440,
          margin: "0 auto 40px", fontWeight: 300,
        }}>
          Grounded in colour science — Munsell's three dimensions, Itten's seasonal theory,
          and simultaneous contrast — translated into the precise shades that make your complexion glow.
        </p>
        <div style={{ display: "flex", gap: 32, justifyContent: "center" }}>
          {[["12","Colour Seasons"],["3","Skin Dimensions"],["50+","Shades Mapped"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: serif, fontSize: 36, fontWeight: 300, color: T.black, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.grey400, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <Divider style={{ maxWidth: 720, margin: "0 auto" }} />

      {/* ── STEP 1: SKIN TONE ── */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "56px 32px" }}>

        {/* Photo upload strip */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          padding: "16px 20px",
          background: T.grey100,
          borderRadius: 4,
          marginBottom: 40, cursor: "pointer",
        }} onClick={() => fileRef.current.click()}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
          {imagePreview ? (
            <img src={imagePreview} alt="preview" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: `1.5px solid ${T.gold}` }} />
          ) : (
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              border: `1px dashed ${T.grey400}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, color: T.grey400,
            }}>○</div>
          )}
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.grey800 }}>
              {imagePreview ? "Photo uploaded" : "Upload a selfie for reference"}
            </div>
            <div style={{ fontSize: 11, color: T.grey400, marginTop: 2 }}>
              Natural light · no filter · face centred · then select your tone below
            </div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 11, color: T.gold, letterSpacing: "0.08em" }}>
            {imagePreview ? "Change ↗" : "Upload ↗"}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <Label>Step 01</Label>
            <h2 style={{ fontFamily: serif, fontSize: 26, fontWeight: 300, marginTop: 4, lineHeight: 1 }}>
              Select your skin tone
            </h2>
          </div>
          {selectedTone && <GoldTag>{selectedTone.name}</GoldTag>}
        </div>

        {/* Skin tone swatches */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
          {SKIN_TONES.map(tone => (
            <Swatch
              key={tone.id} hex={tone.hex} name={tone.name} size="lg" showName
              selected={selectedTone?.id === tone.id}
              onClick={() => setSelectedTone(tone)}
            />
          ))}
        </div>

        <Divider style={{ margin: "32px 0" }} />

        {/* Undertone */}
        <div style={{ marginBottom: 32 }}>
          <Label style={{ marginBottom: 16, display: "block" }}>Step 02 · Undertone</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
            {[
              { id: "warm", label: "Warm", sub: "Gold · Peach · Yellow", indicator: "#D4A050" },
              { id: "cool", label: "Cool", sub: "Pink · Rose · Blue", indicator: "#8898B8" },
              { id: "neutral", label: "Neutral", sub: "Balanced mix", indicator: "#A8A0A0" },
              { id: "olive", label: "Olive", sub: "Yellow-green cast", indicator: "#8A9050" },
            ].map(u => (
              <div
                key={u.id}
                onClick={() => setSelectedUndertone(u.id)}
                style={{
                  padding: "14px 12px", textAlign: "center",
                  border: `1px solid ${selectedUndertone === u.id ? T.gold : T.grey200}`,
                  background: selectedUndertone === u.id ? `${T.gold}08` : T.white,
                  borderRadius: 4, cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: u.indicator, margin: "0 auto 8px" }} />
                <div style={{ fontSize: 12, fontWeight: 500, color: T.grey800 }}>{u.label}</div>
                <div style={{ fontSize: 10, color: T.grey400, marginTop: 2, lineHeight: 1.3 }}>{u.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chroma / Clarity */}
        <div style={{ marginBottom: 40 }}>
          <Label style={{ marginBottom: 16, display: "block" }}>Step 03 · Colour clarity</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { id: "clear", label: "Clear & vivid", sub: "Bright, saturated complexion · colours read bold on you", bar: 85 },
              { id: "soft", label: "Soft & muted", sub: "Delicate, blended complexion · colours read gentle on you", bar: 35 },
            ].map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedTone(prev => prev ? { ...prev, chroma: c.id } : prev)}
                style={{
                  padding: "16px",
                  border: `1px solid ${selectedTone?.chroma === c.id ? T.gold : T.grey200}`,
                  background: selectedTone?.chroma === c.id ? `${T.gold}08` : T.white,
                  borderRadius: 4, cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <div style={{ height: 4, background: T.grey200, borderRadius: 2, marginBottom: 12, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${c.bar}%`, background: T.gold, borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: T.grey800 }}>{c.label}</div>
                <div style={{ fontSize: 10, color: T.grey400, marginTop: 4, lineHeight: 1.4 }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Analyse button */}
        <button
          onClick={handleAnalyse}
          disabled={!selectedTone || analysing}
          style={{
            width: "100%", padding: "16px", background: selectedTone ? T.black : T.grey200,
            color: selectedTone ? T.white : T.grey400,
            border: "none", borderRadius: 4, fontSize: 13, letterSpacing: "0.1em",
            textTransform: "uppercase", fontWeight: 500, cursor: selectedTone ? "pointer" : "not-allowed",
            fontFamily: sans, transition: "all 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          {analysing ? (
            <>
              <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>◌</span>
              Analysing your colour season...
            </>
          ) : "Discover my colour season →"}
        </button>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </section>

      {/* ── RESULT ── */}
      {seasonData && (
        <div ref={resultRef}>
          <div style={{ background: T.black, color: T.white }}>

            {/* Season announcement */}
            <section style={{ maxWidth: 720, margin: "0 auto", padding: "64px 32px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <GroupBadge group={season.group} />
                  <h2 style={{
                    fontFamily: serif, fontSize: "clamp(36px, 5vw, 56px)",
                    fontWeight: 300, lineHeight: 1.1, marginTop: 12, color: T.white,
                  }}>
                    {seasonData.season}
                  </h2>
                  <p style={{ fontSize: 14, color: "#9A9690", lineHeight: 1.8, maxWidth: 460, marginTop: 16 }}>
                    {season.description}
                  </p>
                </div>
                <div style={{
                  padding: "20px 24px", border: `1px solid #2A2A2A`, borderRadius: 4,
                  minWidth: 180,
                }}>
                  <Label style={{ color: "#6A6560" }}>Best metal</Label>
                  <div style={{ fontFamily: serif, fontSize: 20, color: T.goldLight, marginTop: 6, fontWeight: 300 }}>
                    {season.neutrals.metal}
                  </div>
                  <Divider style={{ background: "#2A2A2A", margin: "12px 0" }} />
                  <Label style={{ color: "#6A6560" }}>Best white</Label>
                  <div style={{ fontSize: 12, color: "#C0B8B0", marginTop: 6, lineHeight: 1.4 }}>{season.neutrals.white}</div>
                  <Divider style={{ background: "#2A2A2A", margin: "12px 0" }} />
                  <Label style={{ color: "#6A6560" }}>Contrast</Label>
                  <div style={{ fontSize: 12, color: "#C0B8B0", marginTop: 6, textTransform: "capitalize" }}>{season.contrast}</div>
                </div>
              </div>
            </section>

            {/* Tabs */}
            <div style={{ borderTop: "1px solid #1A1A1A", borderBottom: "1px solid #1A1A1A" }}>
              <div style={{ maxWidth: 720, margin: "0 auto", display: "flex" }}>
                {["palette","outfits","face","makeup"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "16px 20px", background: "none", border: "none",
                      borderBottom: activeTab === tab ? `2px solid ${T.gold}` : "2px solid transparent",
                      color: activeTab === tab ? T.gold : "#6A6560",
                      fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
                      cursor: "pointer", fontFamily: sans, fontWeight: 500, transition: "all 0.2s",
                    }}
                  >{tab}</button>
                ))}
              </div>
            </div>

            {/* ── PALETTE TAB ── */}
            {activeTab === "palette" && (
              <section style={{ maxWidth: 720, margin: "0 auto", padding: "48px 32px" }}>

                {/* Wear palette */}
                <div style={{ marginBottom: 48 }}>
                  <Label style={{ color: "#6A6560" }}>Wear — your season's colours</Label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 20 }}>
                    {season.wears.map((hex, i) => (
                      <div key={i} style={{ textAlign: "center" }}>
                        <div
                          onMouseEnter={() => setHoveredSwatch(i)}
                          onMouseLeave={() => setHoveredSwatch(null)}
                          style={{
                            width: 56, height: 56, borderRadius: "50%",
                            background: hex,
                            border: `1.5px solid rgba(255,255,255,0.1)`,
                            transform: hoveredSwatch === i ? "scale(1.12)" : "scale(1)",
                            transition: "transform 0.2s",
                            cursor: "default",
                          }}
                        />
                        <div style={{ fontSize: 10, color: "#6A6560", marginTop: 6, maxWidth: 60 }}>
                          {season.wearNames[i]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Avoid palette */}
                <div style={{
                  padding: "24px",
                  border: "1px solid #1A1A1A",
                  borderRadius: 4, marginBottom: 48,
                }}>
                  <Label style={{ color: "#6A6560" }}>Avoid — simultaneous contrast works against you</Label>
                  <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
                    {season.avoids.map((hex, i) => (
                      <div key={i} style={{ textAlign: "center" }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: "50%",
                          background: hex, opacity: 0.5,
                          border: "1.5px solid rgba(255,255,255,0.06)",
                          position: "relative",
                        }}>
                          <div style={{
                            position: "absolute", inset: 0, display: "flex",
                            alignItems: "center", justifyContent: "center",
                            fontSize: 14, color: "rgba(255,255,255,0.4)",
                          }}>×</div>
                        </div>
                        <div style={{ fontSize: 10, color: "#4A4A48", marginTop: 6 }}>{season.avoidNames[i]}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Colour theory callout */}
                <div style={{
                  padding: "24px", background: "#0F0F0F",
                  border: "1px solid #1A1A1A", borderRadius: 4,
                }}>
                  <Label style={{ color: T.goldDark }}>Why these colours work — science</Label>
                  <p style={{ fontSize: 13, color: "#8A8480", lineHeight: 1.9, marginTop: 12 }}>
                    <strong style={{ color: "#C0B8B0", fontWeight: 500 }}>Simultaneous contrast</strong> — when a colour sits adjacent to skin, each pushes the other toward its complement. Your {season.group} palette is chosen because it pushes your skin toward its most vivid, healthiest-looking self.
                    {season.group === "Spring" && " Your warm golden undertones glow when surrounded by clear, warm hues — they amplify the eumelanin warmth and suppress any grey cast."}
                    {season.group === "Summer" && " Your cool, muted undertones are brought forward by soft, cool hues — they balance your natural pink-rose flush without overwhelming it."}
                    {season.group === "Autumn" && " Your warm, earthy undertones deepen beautifully beside muted, warm colours — the low chroma of your palette lets your skin's richness lead."}
                    {season.group === "Winter" && " Your high-contrast, cool undertones need clear, vivid colours to match their intensity — anything muted or warm creates a grey, dull effect on your complexion."}
                  </p>
                </div>
              </section>
            )}

            {/* ── OUTFITS TAB ── */}
            {activeTab === "outfits" && (
              <section style={{ maxWidth: 720, margin: "0 auto", padding: "48px 32px" }}>
                <Label style={{ color: "#6A6560", marginBottom: 24, display: "block" }}>Outfit colour pairings for {season.group}</Label>

                {/* Outfit selector */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 32 }}>
                  {outfits.map((o, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveOutfit(i)}
                      style={{
                        cursor: "pointer", borderRadius: 4, overflow: "hidden",
                        border: activeOutfit === i ? `1.5px solid ${T.gold}` : "1.5px solid #1A1A1A",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ height: 40, display: "flex" }}>
                        {[o.top, o.bottom, o.accent].map((c, ci) => (
                          <div key={ci} style={{ flex: 1, background: c }} />
                        ))}
                      </div>
                      <div style={{ padding: "8px 8px", background: "#0A0A0A" }}>
                        <div style={{ fontSize: 10, fontWeight: 500, color: "#C0B8B0" }}>{o.name}</div>
                        <div style={{ fontSize: 9, color: "#4A4A48", marginTop: 2 }}>{o.occasion}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active outfit detail */}
                {outfits[activeOutfit] && (() => {
                  const o = outfits[activeOutfit];
                  return (
                    <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: 4, overflow: "hidden" }}>
                      {/* Colour bar */}
                      <div style={{ height: 80, display: "flex" }}>
                        {[
                          { c: o.top, label: "Top" },
                          { c: o.bottom, label: "Bottom" },
                          { c: o.accent, label: "Accent" },
                        ].map((item, i) => (
                          <div key={i} style={{ flex: 1, background: item.c, position: "relative" }}>
                            <div style={{
                              position: "absolute", bottom: 8, left: 0, right: 0,
                              textAlign: "center", fontSize: 9, letterSpacing: "0.1em",
                              textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
                            }}>{item.label}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: "24px" }}>
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                          <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 300, color: T.white }}>{o.name}</h3>
                          <GoldTag>{o.occasion}</GoldTag>
                        </div>
                        <p style={{ fontSize: 13, color: "#6A6560", marginTop: 8 }}>{o.desc}</p>
                        <Divider style={{ background: "#1A1A1A", margin: "20px 0" }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                          {[
                            { label: "Top", hex: o.top },
                            { label: "Bottom / Skirt", hex: o.bottom },
                            { label: "Accent / Bag", hex: o.accent },
                          ].map(({ label, hex }) => (
                            <div key={label}>
                              <Label style={{ color: "#4A4A48" }}>{label}</Label>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                                <div style={{ width: 20, height: 20, borderRadius: "50%", background: hex, border: "1px solid #2A2A2A" }} />
                                <span style={{ fontSize: 11, color: "#8A8480", fontFamily: "monospace" }}>{hex.toUpperCase()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Principle note */}
                <div style={{ marginTop: 24, padding: "20px", border: "1px solid #1A1A1A", borderRadius: 4 }}>
                  <Label style={{ color: "#4A4A48" }}>Colour theory applied</Label>
                  <p style={{ fontSize: 12, color: "#6A6560", lineHeight: 1.9, marginTop: 10 }}>
                    Each pairing uses your season's best neutrals as base and accent colours as directing agents.
                    High-contrast colour near the face directs attention upward.
                    Matched-value tonal dressing creates elegance and length.
                    Triadic colour relationships in accessories prevent the look from reading flat.
                  </p>
                </div>
              </section>
            )}

            {/* ── FACE TAB ── */}
            {activeTab === "face" && (
              <section style={{ maxWidth: 720, margin: "0 auto", padding: "48px 32px" }}>
                <Label style={{ color: "#6A6560", marginBottom: 24, display: "block" }}>Select your face shape</Label>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 32 }}>
                  {FACE_SHAPES.map(f => (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFace(f)}
                      style={{
                        padding: "20px 12px", textAlign: "center",
                        border: `1px solid ${selectedFace?.id === f.id ? T.gold : "#1A1A1A"}`,
                        background: selectedFace?.id === f.id ? "#0F0D08" : "#0A0A0A",
                        borderRadius: 4, cursor: "pointer", transition: "all 0.2s",
                      }}
                    >
                      <FaceSVG id={f.id} active={selectedFace?.id === f.id} />
                      <div style={{ fontSize: 12, fontWeight: 500, color: selectedFace?.id === f.id ? T.goldLight : "#8A8480", marginTop: 10 }}>{f.name}</div>
                      <div style={{ fontSize: 10, color: "#4A4A48", marginTop: 4, lineHeight: 1.4 }}>{f.ratios}</div>
                    </div>
                  ))}
                </div>

                {selectedFace && (
                  <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: 4, padding: 28 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                      <FaceSVG id={selectedFace.id} active />
                      <div>
                        <h3 style={{ fontFamily: serif, fontSize: 24, fontWeight: 300, color: T.white }}>{selectedFace.name}</h3>
                        <div style={{ fontSize: 11, color: "#4A4A48", marginTop: 4 }}>{selectedFace.ratios}</div>
                      </div>
                    </div>
                    <Divider style={{ background: "#1A1A1A", marginBottom: 20 }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                      <div>
                        <Label style={{ color: "#4A4A48", display: "block", marginBottom: 12 }}>Styling principles</Label>
                        {selectedFace.styling.map((s, i) => (
                          <div key={i} style={{
                            fontSize: 12, color: "#8A8480", lineHeight: 1.7, paddingLeft: 12,
                            borderLeft: `1px solid ${i === 0 ? T.goldDark : "#2A2A2A"}`,
                            marginBottom: 8, paddingBottom: 8,
                          }}>{s}</div>
                        ))}
                      </div>
                      <div>
                        <div style={{ marginBottom: 20 }}>
                          <Label style={{ color: "#4A4A48", display: "block", marginBottom: 10 }}>Best necklines</Label>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {selectedFace.necklines.map(n => (
                              <span key={n} style={{
                                fontSize: 10, padding: "4px 10px",
                                background: "#141414", border: "1px solid #2A2A2A",
                                borderRadius: 2, color: "#8A8480",
                              }}>{n}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label style={{ color: "#4A4A48", display: "block", marginBottom: 10 }}>Best earrings</Label>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {selectedFace.earrings.map(e => (
                              <span key={e} style={{
                                fontSize: 10, padding: "4px 10px",
                                background: "#141414", border: "1px solid #2A2A2A",
                                borderRadius: 2, color: "#8A8480",
                              }}>{e}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Colour + face connection */}
                    <div style={{ marginTop: 24, padding: "16px", background: "#0F0D08", border: `1px solid ${T.goldDark}30`, borderRadius: 4 }}>
                      <Label style={{ color: T.goldDark }}>Colour placement for {selectedFace.name} shape</Label>
                      <p style={{ fontSize: 12, color: "#6A6560", lineHeight: 1.9, marginTop: 8 }}>
                        {selectedFace.id === "oval" && "Colour near the face always works. Use your season's brightest shades at the neckline to draw attention to your balanced proportions."}
                        {selectedFace.id === "round" && "Place bright, warm colour from your palette in a vertical direction — a V-neck in your best jewel tone creates instant length."}
                        {selectedFace.id === "square" && "Use your season's softest, most draped tones near the face. Avoid high-contrast horizontal colour banding at the jaw level."}
                        {selectedFace.id === "heart" && "Your palette's muted tones belong near the face, with richer accent colours lower on the body to visually balance."}
                        {selectedFace.id === "diamond" && "Use your palette's boldest colours at neckline and hemline simultaneously to widen both narrow points."}
                        {selectedFace.id === "oblong" && "Horizontal colour banding is your friend — wear your accent colour as a bold belt or colour-blocked middle section."}
                      </p>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* ── MAKEUP TAB ── */}
            {activeTab === "makeup" && (
              <section style={{ maxWidth: 720, margin: "0 auto", padding: "48px 32px" }}>
                <Label style={{ color: "#6A6560", marginBottom: 24, display: "block" }}>Makeup harmony for {seasonData.season}</Label>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
                  {[
                    { label: "Lip colour", hex: season.makeup.lip, principle: "Mimic or harmonise with your natural flush — never fight it" },
                    { label: "Eye shadow", hex: season.makeup.eye, principle: "Complement your eye colour through analogous or complementary hues" },
                    { label: "Blush", hex: season.makeup.blush, principle: "Replicate your natural flush tone for seamless, healthy-looking colour" },
                    { label: "Brow tone", hex: null, label2: season.makeup.brow, principle: "Match brow colour to hair undertone — never go darker than two shades" },
                  ].map((m, i) => (
                    <div key={i} style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: 4, padding: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        {m.hex ? (
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: m.hex, border: "1px solid #2A2A2A" }} />
                        ) : (
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: "linear-gradient(135deg, #6A4A28, #3A2010)",
                            border: "1px solid #2A2A2A",
                          }} />
                        )}
                        <div>
                          <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4A4A48" }}>{m.label}</div>
                          <div style={{ fontSize: 13, color: T.white, marginTop: 3 }}>
                            {m.hex ? m.hex.toUpperCase() : m.label2}
                          </div>
                        </div>
                      </div>
                      <p style={{ fontSize: 11, color: "#4A4A48", lineHeight: 1.7 }}>{m.principle}</p>
                    </div>
                  ))}
                </div>

                <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: 4, padding: 24 }}>
                  <Label style={{ color: "#4A4A48" }}>Foundation undertone guide</Label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16 }}>
                    {[
                      { label: "Foundation", value: selectedTone?.undertone === "cool" ? "Pink or neutral-cool base" : selectedTone?.undertone === "olive" ? "Yellow-olive base" : "Yellow or peach base" },
                      { label: "Concealer", value: "One shade lighter than foundation, matching undertone exactly" },
                      { label: "Contour", value: selectedTone?.undertone === "cool" ? "Cool grey-taupe" : "Warm brown-bronze" },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <Label style={{ color: "#4A4A48", display: "block", marginBottom: 6 }}>{label}</Label>
                        <div style={{ fontSize: 12, color: "#8A8480", lineHeight: 1.6 }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* ── SCIENCE STRIP ── */}
          <section style={{ background: T.offwhite, padding: "56px 32px" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <Label style={{ marginBottom: 8, display: "block" }}>The science behind Amour Estilo</Label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: T.grey200, border: `1px solid ${T.grey200}` }}>
                {[
                  { title: "Munsell System", body: "Your skin is mapped on three axes: value (depth), hue (undertone), and chroma (clarity) — the same system used by paint manufacturers and colour scientists worldwide." },
                  { title: "Itten's Seasons", body: "Johannes Itten at the Bauhaus first noticed that colour harmony in art mirrors nature's seasonal palettes. Suzanne Caygill applied this to human colouring in the 1950s." },
                  { title: "Simultaneous Contrast", body: "Chevreul's 1839 discovery: adjacent colours push each other toward their complements. Every colour recommendation is chosen to push your skin toward its most vibrant state." },
                ].map(({ title, body }) => (
                  <div key={title} style={{ background: T.white, padding: "28px 24px" }}>
                    <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 400, marginBottom: 10 }}>{title}</div>
                    <p style={{ fontSize: 12, color: T.grey600, lineHeight: 1.8 }}>{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── RESET ── */}
          <section style={{ maxWidth: 720, margin: "0 auto", padding: "48px 32px", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: T.grey400, marginBottom: 16 }}>Not quite right? Adjust your inputs and re-analyse.</p>
            <button
              onClick={() => { setStep("tone"); setSeasonData(null); setSelectedTone(null); setSelectedUndertone(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              style={{
                padding: "12px 32px", background: "none",
                border: `1px solid ${T.grey200}`, borderRadius: 4,
                fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
                color: T.grey600, cursor: "pointer", fontFamily: sans,
              }}
            >Start over</button>
          </section>
        </div>
      )}

      {/* ── FOOTER ── */}
   
    </div>
  );
}