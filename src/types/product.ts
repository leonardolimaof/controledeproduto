export interface Product {
  id: string;
  name: string;
  barcode: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  transactions?: ProductTransaction[];
}

export interface ProductTransaction {
  id: string;
  productId: string;
  type: 'entry' | 'exit';
  quantity: number;
  date: Date;
  reason?: string;
}

export interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  selectedProduct: Product | null;
}

export interface StockSummary {
  date: Date;
  totalQuantity: number;
  entries: number;
  exits: number;
}