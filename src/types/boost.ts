export type BoostOption = {
  id: string;
  label: string;          // e.g. "+5,000 🎲"
  originalPrice: number;  // base price
  itemPrice: number;      // base discounted price (before dice-based discount)
  price: number;          // final price (with dice discount applied)
};