import type { Dispatch, SetStateAction } from "react";
type Category = {
  id: number;
  name: string;
};

export interface FiltersProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  categories: Category[];


}

export type Product = {
  id: number;
  name: string;
  category: { id: number; name: string };
  price: number;
  price_after?: number;
  quantity: number;
  created_at: string;
};

export type ProductFormData = {
  name: string;
  description: string;
  price: number | "";
  quantity: number | "";
  is_offer: boolean;
  offer_name?: string;
  price_after?: number | "";
  image?: File | null;
};
// كل قسم
export type Categories = {
  id: number;
  name: string;
  image?: string;
  parent?: {
    id: number;
    name: string;
    image?: string;
    parent_id?: number;
    created_at?: string;
    updated_at?: string;
  } | null;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
  products?: any[];
};


export type Department = {
  Categories: Categories[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};
// types/ads.ts
export interface Ad {
  id: number;
  title: string;
  image: string;
  type: "slider" | "banner"; // إذا الأنواع بس ذني
  link?: string;
  hotel?: string;
  active?: boolean;
}

export interface AdsResponse {
  ads: Ad[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
export interface AdItem {
  id?: number;
  type?: string;
  image?: string; 
  title?: string;
  product_id?: number;
}

type Pro = {
  id: number;
  name: string;
};
type ProductItem = {

  data: Pro[];
};
export interface ProductAds {

  products:ProductItem;
}

type TermData = {
  id: number;
  title: string;
  content: string;
};

export type Term ={
 data:
  TermData;
}



type ProductDetail = {
  id: number;
  name: string;
  image: string;
  description: string;
  quantity: number;
  price: number;
  price_after: number;
  offer_name?: string;
  pivot: {
    order_id: number;
    product_id: number;
    quantity: number;
  };
};

type Address = {
  id: number;
  name?: string;
  governorate: {
    id: number;
    name: string;
    delivery_price: number;
  };
  longitude: string;
  latitude: string;
};

type DataOrder={
  id: number;
  status: string;
  total: number;
  delivery_price: number;
  total_with_delivery_price: number;
  discount: number;
  products: ProductDetail[];
  address: Address;
}

export type OrderDetails = {
data:DataOrder
};
type CouponData = {
  id: number;
  code: string;
  type: string;
  value: string;
  expires_at: string;
  minimum_order_amount: string;
};

export interface Coupon {
  data: CouponData[];
}
export interface ProductsResponse {
  products: {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };

}


export type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  orders_count: number;
};

export type ReportsCustomersResponse = {
  data: Customer[];


};
export type TopSellingProduct = {
  id: number;
  name: string;
  image: string;
  description: string | null;
  quantity: number;
  price: number;
  price_after: number;
  category_id: number;
  is_offer: boolean;
  created_at: string | null;
  updated_at: string | null;
  offer_name?: string | null;
  total_sold: string; // لو تحب ممكن تحوّله number
};

export type TopSellingProductsResponse = {
  data: TopSellingProduct[];
};
