// Real pricing pulled from Barclay's current service menu (as provided).
// "+" pricing reflects starting rates — final cost is confirmed at consultation.

export type ServiceItem = {
  name: string;
  desc?: string;
  price: string;
};

export type ServiceCategory = {
  id: string;
  label: string;
  items: ServiceItem[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "cuts",
    label: "Haircuts",
    items: [
      { name: "Buzz Cut", desc: "Clippers, same length all over", price: "$32+" },
      { name: "Children's Haircut", desc: "12 & under", price: "$38+" },
      { name: "Short Haircut", desc: "Chin length or above", price: "$61+" },
      { name: "Medium Haircut", desc: "Above collarbone", price: "$74+" },
      { name: "Long Haircut", desc: "Collarbone to mid-back", price: "$79+" },
      { name: "Extra Long Haircut", desc: "Bottom of shoulder blade", price: "$84+" },
      { name: "Shampoo / Blowout", price: "$42+" },
    ],
  },
  {
    id: "color",
    label: "Color & Balayage",
    items: [
      { name: "Partial Balayage", desc: "Custom blonding", price: "$145+" },
      { name: "Full Balayage", desc: "Custom blonding", price: "$161+" },
      { name: "Partial Foil (11–31 foils)", price: "$127+" },
      { name: "Full Foil (31+ foils)", price: "$148+" },
      { name: "Custom Color", price: "$101+" },
      { name: "Men's Camo Color", price: "$60+" },
      { name: "Color Correction", desc: "Per hour", price: "$107+" },
      { name: "Glaze", price: "$50+" },
      { name: "Fashion Color", price: "$101+" },
    ],
  },
  {
    id: "texture",
    label: "Texture & Treatments",
    items: [
      { name: "Full Perm", price: "$106+" },
      { name: "Partial Perm", price: "$87+" },
      { name: "Straightening", desc: "Per hour", price: "$69+" },
      { name: "Brazilian Blowout", price: "$310+" },
      { name: "ABC Bonding Deep Treatment", price: "$30+" },
      { name: "Hair Extensions", desc: "Upon consultation", price: "Custom" },
    ],
  },
  {
    id: "waxing",
    label: "Waxing",
    items: [
      { name: "Brow Wax", price: "$23+" },
      { name: "Chin Wax", price: "$18+" },
      { name: "Lip Wax", price: "$18+" },
      { name: "Nose Wax", price: "$18+" },
      { name: "Ear Wax", price: "$18+" },
    ],
  },
  {
    id: "packages",
    label: "Packages",
    items: [
      { name: "Custom Color & Glaze Package", price: "$151+" },
      { name: "Partial Balayage Pkg", desc: "Base color + glaze", price: "$296+" },
      { name: "Full Balayage Pkg", desc: "Base color + glaze", price: "$312+" },
      { name: "Partial Foil Pkg", desc: "Base color + glaze", price: "$278+" },
      { name: "Full Foil Pkg", desc: "Base color + glaze", price: "$299+" },
    ],
  },
];
