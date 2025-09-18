export interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  quantity: number;
  price: number;
  price_after: number;
  category_id: number;
  is_offer: boolean;
  created_at: string | null;
  updated_at: string | null;
  offer_name: string | null;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  parent?: Category | null; // القسم الأب
  parent_id?: number | null;
  products_count: number;
  created_at: string;
  updated_at: string;
  products: Product[];
}

export interface DepartmentsResponse {
  Categories: Category[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
