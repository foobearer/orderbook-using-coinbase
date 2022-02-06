export interface ProductsAndCurrencies {
  type: string;
  currencies: Array<Currencies>;
  products: Array<Products>;
}

export interface Currencies {
  id: string;
  name: string;
  details: {};
  min_size: string;
  status: string;
  funding_account_id: string;
}

export interface Products {
  id: string;
  base_currency: string;
  quote_currency: string;
  base_min_size: string;
  base_max_size: string;
}

export interface ProductSpecificOrders {
  changes: Array<any>;
  product_id: string;
  time: string;
  type: string;
}

