export type Product = {
  id: string;
  name: string;
  set_name?: string;
  description?: string;
  image_url: string;
  price: number;
  original_price?: number;
  category?: string;
  stars?: number; // 1–6
  isGolden?: boolean;
};
