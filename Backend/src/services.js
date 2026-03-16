// Backend/src/services.js
// Single source of truth for all salon services
// Used by server.js to serve /services and /api/services

const SERVICES = [
  // ── Designer Haircuts & Styles ──
  { id: "haircut-buzz-cut",    category: "Designer Haircuts & Styles", name: "Haircut - Buzz Cut (same length all over with clippers)", base_price_cents: 2900  },
  { id: "haircut-children-12", category: "Designer Haircuts & Styles", name: "Haircut - Children (12 & under)",                         base_price_cents: 3500  },
  { id: "haircut-clippers",    category: "Designer Haircuts & Styles", name: "Haircut - Clippers (with some scissor work)",              base_price_cents: 4800  },
  { id: "haircut-extra-long",  category: "Designer Haircuts & Styles", name: "Haircut - Extra Long (bottom of shoulder blade)",          base_price_cents: 7600  },
  { id: "haircut-long",        category: "Designer Haircuts & Styles", name: "Haircut - Long (collarbone to mid-back)",                  base_price_cents: 7100  },
  { id: "haircut-medium",      category: "Designer Haircuts & Styles", name: "Haircut - Medium (above collarbone)",                      base_price_cents: 6600  },
  { id: "haircut-short",       category: "Designer Haircuts & Styles", name: "Haircut - Short (chin length or above)",                   base_price_cents: 6100  },
  { id: "shampoo-blowout",     category: "Designer Haircuts & Styles", name: "Shampoo / Blowout",                                        base_price_cents: 3600  },

  // ── Color ──
  { id: "color-full-foil-custom-blonding",    category: "Color", name: "Full Foil Custom Blonding Service (31+ foils)",          base_price_cents: 13300 },
  { id: "color-partial-foil-custom-blonding", category: "Color", name: "Partial Foil Custom Blonding Service (11–31 foils)",     base_price_cents: 11200 },
  { id: "color-full-balayage-custom-blonding",    category: "Color", name: "Full Balayage Custom Blonding Service",              base_price_cents: 14000 },
  { id: "color-partial-balayage-custom-blonding", category: "Color", name: "Partial Balayage Custom Blonding Service",           base_price_cents: 12500 },
  { id: "color-full-mesh-cap-custom-blonding",    category: "Color", name: "Full Mesh Cap Custom Blonding Service",              base_price_cents: 9400  },
  { id: "color-partial-mesh-cap-custom-blonding", category: "Color", name: "Partial Mesh Cap Custom Blonding Service",           base_price_cents: 8000  },
  { id: "color-permanent",          category: "Color", name: "Permanent Color",        base_price_cents: 8400  },
  { id: "color-demi-permanent",     category: "Color", name: "Demi-Permanent Color",   base_price_cents: 8400  },
  { id: "color-mens-camo",          category: "Color", name: "Men's Camo Color",       base_price_cents: 4800  },
  { id: "color-bleach-retouch-hourly", category: "Color", name: "Bleach Retouch (per hour)",   base_price_cents: 9300 },
  { id: "color-correction-hourly",     category: "Color", name: "Color Correction (per hour)", base_price_cents: 9300 },
  { id: "color-glaze",     category: "Color", name: "Glaze",       base_price_cents: 4500 },
  { id: "color-brow-tint", category: "Color", name: "Brow Tint",   base_price_cents: 2000 },
  { id: "color-fashion",   category: "Color", name: "Fashion Color", base_price_cents: 8800 },

  // ── Texture ──
  { id: "texture-full-perm",             category: "Texture", name: "Full Perm",                    base_price_cents: 9200  },
  { id: "texture-partial-perm",          category: "Texture", name: "Partial Perm",                 base_price_cents: 7400  },
  { id: "texture-spiral-perm",           category: "Texture", name: "Spiral Perm",                  base_price_cents: 12900 },
  { id: "texture-straightening-hourly",  category: "Texture", name: "Straightening (per hour)",     base_price_cents: 9000  },
  { id: "texture-extensions-consult",    category: "Texture", name: "Hair Extensions (consultation)", base_price_cents: 0   },
  { id: "texture-brazilian-blowout",     category: "Texture", name: "Brazilian Blowout",            base_price_cents: 29000 },

  // ── Treatments ──
  { id: "treatment-shot-phase-deep-conditioning", category: "Treatments", name: "Shot Phase Deep Conditioning Treatment", base_price_cents: 3000 },
  { id: "treatment-abc-bonding-deep",             category: "Treatments", name: "ABC Bonding Deep Treatment",             base_price_cents: 3000 },
  { id: "treatment-pre-art",                      category: "Treatments", name: "Pre Art Treatment",                     base_price_cents: 1500 },
  { id: "treatment-cat",                          category: "Treatments", name: "Cat Treatment",                         base_price_cents: 1500 },
  { id: "treatment-heat",                         category: "Treatments", name: "Heat Treatment",                        base_price_cents: 3500 },

  // ── Waxing ──
  { id: "waxing-chin",  category: "Waxing", name: "Chin Wax",  base_price_cents: 1500 },
  { id: "waxing-brow",  category: "Waxing", name: "Brow Wax",  base_price_cents: 2000 },
  { id: "waxing-nose",  category: "Waxing", name: "Nose Wax",  base_price_cents: 1500 },
  { id: "waxing-lip",   category: "Waxing", name: "Lip Wax",   base_price_cents: 1500 },
  { id: "waxing-ear",   category: "Waxing", name: "Ear Wax",   base_price_cents: 1500 },

  // ── Packages ──
  { id: "pkg-custom-color-glaze",          category: "Packages", name: "Custom Color & Glaze Package",                          base_price_cents: 13300 },
  { id: "pkg-full-foil-base-glaze",        category: "Packages", name: "Full Foil Custom Package - Base Color & Glaze",         base_price_cents: 26800 },
  { id: "pkg-partial-foil-base-glaze",     category: "Packages", name: "Partial Foil Custom Package - Base Color & Glaze",      base_price_cents: 24800 },
  { id: "pkg-full-balayage-base-glaze",    category: "Packages", name: "Full Balayage Custom Package - Base Color & Glaze",     base_price_cents: 27800 },
  { id: "pkg-partial-balayage-base-glaze", category: "Packages", name: "Partial Balayage Custom Package - Base Color & Glaze",  base_price_cents: 26300 },
  { id: "pkg-full-mesh-cap-base-glaze",    category: "Packages", name: "Full Mesh Cap Custom Package - Base Color & Glaze",     base_price_cents: 21600 },
  { id: "pkg-shine-bomb-blowout",          category: "Packages", name: "Special Shine Bomb Blowout (Stand-alone glaze)",        base_price_cents: 8800  },
];

module.exports = SERVICES;
