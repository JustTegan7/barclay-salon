// Real client quotes from Barclay's public Facebook reviews
// (aggregated at reviews.birdeye.com/barclays-hair-design-149513547328581).
// When adding more, use real quotes only, checked against the original post.

export type Review = {
  quote: string;
  who: string;
};

export const reviews: Review[] = [
  {
    quote:
      "Love this place! Ryan has been doing my hair for 16 years, and he and the team are great with my kids. Barclay's rocks!",
    who: "Carrie W., via Facebook",
  },
  {
    quote: "Mary-Michael is the balayage queen. My hair is amazing. Thank you.",
    who: "Lori P., via Facebook",
  },
  {
    quote: "Mary-Michael is the best — love my color and cut! Worth every penny.",
    who: "Sandy B., via Facebook",
  },
];
