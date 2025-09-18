export type Governorate = {
  id: number;
  name: string;
  delivery_price: number;
};

export type Address = {
  id: number;
  name: string | null;
  governorate: Governorate | null;
  longitude: string | null;
  latitude: string | null;
};

export type Client = {
  id: number;
  name: string;
  phone: string;
  email: string;
  is_active: boolean;
  fcm_token: string | null;
  birth_date: string | null;
  phone_verified_at: string | null;
  is_confirmed: boolean;
  verification_code_requests: number;
  last_verification_code_sent_at: string | null;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ProductPivot = {
  quantity: number;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  price_after: number;
  image: string;
  offer_name?: string | null;
  pivot: ProductPivot;
};

export type OrderDetails = {
  id: number;
  status: string;
  total: number;
  delivery_price: number;
  total_with_delivery_price: number;
  discount: number;
  client: Client;
  products: Product[];
  address: Address | null;
};

export type OrderDetailsResponse = {
  data: OrderDetails;
};
