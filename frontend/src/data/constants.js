export const PH_CLASSES = [
  {
    key: "acidic",
    label: "Strongly Acidic",
    range: "< 4.0",
    color: "var(--color-ph-acidic)",
    weight: 1.25,
    interpretation:
      "Usually driven by low Ca and Mg saturation (%Ca, %Mg) on a modest CEC — the signature of a heavily leached, base-poor soil. Below pH 4, aluminium and manganese solubility rises sharply enough to become root-toxic, phosphorus locks up with iron/aluminium oxides, and nitrogen mineralisation slows as microbial activity is suppressed. It's advisable to apply agricultural lime (CaCO₃) or dolomitic lime if Mg is also low, scaling the rate to your CEC — high-CEC, clay-rich soils are more strongly buffered and need more lime per pH point than sandy, low-CEC soils. Retest 3–6 months after liming, and favour acid-tolerant crops (tea, pineapple, cassava) on fields you can't correct right away.",
  },
  {
    key: "modacidic",
    label: "Moderately Acidic",
    range: "4.0 – 6.0",
    color: "var(--color-ph-modacidic)",
    weight: 1,
    interpretation:
      "Typically reflects moderate Ca and Mg levels with the CEC only partly saturated by base cations. Phosphorus availability starts declining as pH drops toward 6, since P increasingly binds with iron and aluminium, while N and K uptake are usually still adequate. A light liming pass (or split applications) is recommended as it nudges pH toward the 6–8 sweet spot without overshooting into micronutrient lockout. Legumes, maize, and most vegetables tolerate this range well — prioritise monitoring Ca/Mg saturation over aggressive correction.",
  },
  {
    key: "neutral",
    label: "Neutral",
    range: "6.0 – 8.0",
    color: "var(--color-ph-neutral)",
    weight: 1,
    interpretation:
      "Driven by well-balanced Ca, Mg, and K saturation on a moderate-to-high CEC — the hallmark of a well-buffered, fertile soil. Nitrogen, phosphorus, and potassium all sit near peak availability in this band, and microbial activity (mineralisation, nitrification) runs efficiently. No corrective amendment is needed. Consider maintaining organic matter and balanced NPK fertilisation to keep the soil in this range as crops draw down nutrients season after season.",
  },
  {
    key: "modalkaline",
    label: "Moderately Alkaline",
    range: "8.0 – 10.0",
    color: "var(--color-ph-modalkaline)",
    weight: 1,
    interpretation:
      "Usually driven by high %Ca saturation (often free calcium carbonate) alongside rising Na and SAR — early signs of a calcareous or sodium-influenced soil. Phosphorus fixes with calcium into insoluble compounds, and iron, manganese, zinc, and boron grow progressively less soluble, often showing up as interveinal yellowing on new leaves. It's advised to apply elemental sulphur or ammonium-based/acidifying fertilisers to gradually lower pH, work in organic matter to buffer further alkalinisation, and correct acute deficiencies with chelated (EDTA) foliar sprays while the soil amendment takes effect.",
  },
  {
    key: "alkaline",
    label: "Strongly Alkaline",
    range: "> 10.0",
    color: "var(--color-ph-alkaline)",
    weight: 1.25,
    interpretation:
      "Driven almost entirely by sodium dominance — high Na, SAR, and ESP relative to Ca and Mg on the CEC. Soils are generally classed as sodic once SAR exceeds ~13 or ESP exceeds ~15%: clay particles disperse, structure collapses, and water infiltration/aeration drop sharply on top of severe micronutrient lockout. Applying gypsum (CaSO₄) is recommended to supply Ca²⁺ that displaces exchangeable sodium, then leach with good-quality irrigation water so the displaced Na moves below the root zone (confirm drainage is adequate first). Given the compounding structural and nutrient issues, a full lab soil test and an agronomist-guided remediation plan are strongly advised before replanting.",
  },
];

export const FIELD_RANGES = {
  N: { min: 0, max: 2.1 },
  P: { min: 0, max: 350 },
  K: { min: 0, max: 10 },
  Ca: { min: 0, max: 50 },
  Mg: { min: 0, max: 20 },
  Na: { min: 0, max: 15 },
  CEC: { min: 0, max: 60 },
  SAR: { min: 0, max: 26 },
  ESP: { min: 0, max: 100 },
  SAND: { min: 0, max: 100 },
  SILT: { min: 0, max: 100 },
  CLAY: { min: 0, max: 100 },
};

export const TOOLTIPS = {
  N: `Nitrogen (mass %, Kjeldahl) | Range : 0.0 - 2.1
      Vital for plant growth and photosynthesis. Too much or too little amount will harm crop yields.`,
  P: `Phosphorus  (mg kg⁻¹, Olsen/Bray) | Range : 0 - 350 
      Critical for root development and flowering, but largely immobile soil nutrient stored in organic and inorganic pools that plants depend on for growth and energy.`,
  K: `Potassium (Cmol(+) kg⁻¹) | Range : 0 - 10
      Vital for plant development and stress resistance. It help regulate water, enzymes, and disease resistance.`,
  Ca: `Calcium (Cmol(+) kg⁻¹) | Range : 0 - 50
      Helps raise soil pH by displacing smaller, acidic ions from the soil's negatively charged colloids and improve soil structure by binding particles together`,
  Mg: `Magnesium (Cmol(+) kg⁻¹) | Range : 0 - 20
      Central component of chlorophyll and vital for enzyme activation. Usually lower than Calcium`,
  Na: `Sodium (Cmol(+) kg⁻¹) | Range : 0 - 15
      High levels cause sodicity and structural damage. Despite often associated with toxicity, managed levels of sodium serve as a beneficial functional nutrients that can substitute for potassium, improve water transport, and optimize performance of C4 crops`,
  CEC: `Cation Exchange Capacity (Cmol(+) kg⁻¹, NH₄OAc) | Range : 0 - 60
       Measurement of soil's ability to retain and exchange positive ions. High CEC soils efficiently store nutrients for less frequent applications, while low CEC soils demand smaller, repeated doses and added organic matter to combat nutrient leaching `,
  SAR: `Sodium Exchange Ratio (Ratio) | Range : 0 - 26
       Index of sodium proportion relative to Calcium and Magnesium. SAR above 13 is often associated with sodic soils.`,
  ESP: `Exchangeable Sodium Percentage (%) | Range : 0 - 100
       Fraction of Cation Exchange Capacity occupied by Sodium. High ESP often associated with water infiltration issues and sodicity risk.`,
  SAND: `Sand (mass %, Bouyoucos) | Range : 0 - 100
        Coarsest particle fraction (0.05 to 2.0 mm). Creates irregular pore spaces which speed up water drainage and increase aeration.`,
  SILT: `Silt (mass %, Bouyoucos) | range : 0 - 100
        Medium particle fraction (0.002 to 0.05 mm). Holds moisture and nutrients much better than sand, but lightweight which makes silty soils highly susceptible to wind and water erosion.`,
  CLAY: `CLAY (mass %, Bouyoucos) | Range : 0 - 100
        Finest particle fraction (less than 0.002 mm). It's massive and negatively charged surface area strongly binds essential plant nutrients and water (which can restrict airflow and drainage if too much).`
};

export const BATCH_INPUT_COLS = [
  "P",
  "SAND",
  "CLAY",
  "N",
  "K",
  "Ca",
  "Mg",
  "Na",
  "CEC",
  "SAR",
  "ESP",
];

export const DEFAULT_SINGLE_INPUTS = {
  SAND: 40,
  CLAY: 30,
  SILT: 30,
  N: 0.2,
  P: 15,
  Ca: 12,
  K: 0.5,
  Mg: 3,
  Na: 0.5,
  CEC: 20,
  SAR: 2,
  ESP: 5,
};
