import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Product, ProductsState, ProductTransaction, StockSummary } from '@/types/product';
import { v4 as uuidv4 } from 'uuid';
import { subDays, startOfDay, isAfter, isSameDay, format } from 'date-fns';

const initialState: ProductsState = {
  products: [],
  isLoading: false,
  error: null,
  selectedProduct: null,
};

export const useProductStore = create<
  ProductsState & {
    addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateProduct: (id: string, product: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    selectProduct: (id: string | null) => void;
    searchProducts: (query: string) => Product[];
    recordTransaction: (productId: string, type: 'entry' | 'exit', quantity: number, reason?: string) => void;
    getProductTransactions: (productId: string) => ProductTransaction[];
    getStockHistory: (days?: number) => StockSummary[];
    getProductMovement: (days?: number) => { entries: number[], exits: number[], labels: string[] };
    getProductDwellTime: () => { labels: string[], data: number[] };
  }
>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        addProduct: (productData) => {
          const newProduct: Product = {
            id: uuidv4(),
            name: productData.name,
            barcode: productData.barcode,
            quantity: productData.quantity,
            createdAt: new Date(),
            updatedAt: new Date(),
            transactions: [{
              id: uuidv4(),
              productId: '',  // Will be set after product creation
              type: 'entry',
              quantity: productData.quantity,
              date: new Date(),
              reason: 'Estoque inicial'
            }]
          };
          
          // Set the product ID in the initial transaction
          newProduct.transactions![0].productId = newProduct.id;

          set((state) => ({
            products: [...state.products, newProduct],
          }));
        },
        updateProduct: (id, updatedProduct) => {
          set((state) => ({
            products: state.products.map((product) =>
              product.id === id
                ? {
                    ...product,
                    ...updatedProduct,
                    updatedAt: new Date(),
                  }
                : product
            ),
            selectedProduct:
              state.selectedProduct?.id === id
                ? {
                    ...state.selectedProduct,
                    ...updatedProduct,
                    updatedAt: new Date(),
                  }
                : state.selectedProduct,
          }));
        },
        deleteProduct: (id) => {
          set((state) => ({
            products: state.products.filter((product) => product.id !== id),
            selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct,
          }));
        },
        selectProduct: (id) => {
          if (id === null) {
            set({ selectedProduct: null });
            return;
          }
          
          const product = get().products.find((p) => p.id === id) || null;
          set({ selectedProduct: product });
        },
        searchProducts: (query) => {
          const lowerCaseQuery = query.toLowerCase();
          return get().products.filter(
            (product) =>
              product.name.toLowerCase().includes(lowerCaseQuery) ||
              product.barcode.toLowerCase().includes(lowerCaseQuery)
          );
        },
        recordTransaction: (productId, type, quantity, reason) => {
          const newTransaction: ProductTransaction = {
            id: uuidv4(),
            productId,
            type,
            quantity,
            date: new Date(),
            reason
          };
          
          set((state) => {
            const updatedProducts = state.products.map(product => {
              if (product.id === productId) {
                const newQuantity = type === 'entry' 
                  ? product.quantity + quantity 
                  : Math.max(0, product.quantity - quantity);
                
                return {
                  ...product,
                  quantity: newQuantity,
                  updatedAt: new Date(),
                  transactions: [...(product.transactions || []), newTransaction]
                };
              }
              return product;
            });
            
            return {
              products: updatedProducts,
              selectedProduct: state.selectedProduct?.id === productId
                ? updatedProducts.find(p => p.id === productId) || null
                : state.selectedProduct
            };
          });
        },
        getProductTransactions: (productId) => {
          const product = get().products.find(p => p.id === productId);
          return product?.transactions || [];
        },
        getStockHistory: (days = 30) => {
          const endDate = startOfDay(new Date());
          
          // Create array of all dates in range for the x-axis
          const dateArray: Date[] = [];
          for (let i = 0; i < days; i++) {
            dateArray.push(subDays(endDate, i));
          }
          dateArray.reverse(); // Put in chronological order
          
          // Calculate stock levels for each date
          return dateArray.map(date => {
            
            // Get all transactions up to and including this date
            const allTransactionsToDate = get().products.flatMap(product => 
              (product.transactions || []).filter(t => 
                !isAfter(t.date, date)
              )
            );
            
            // Calculate totals for the day
            const todayTransactions = allTransactionsToDate.filter(t => 
              isSameDay(t.date, date)
            );
            
            const entries = todayTransactions
              .filter(t => t.type === 'entry')
              .reduce((sum, t) => sum + t.quantity, 0);
              
            const exits = todayTransactions
              .filter(t => t.type === 'exit')
              .reduce((sum, t) => sum + t.quantity, 0);
            
            // Calculate total quantity by summing all transactions up to this date
            const totalQuantity = allTransactionsToDate.reduce(
              (sum, t) => sum + (t.type === 'entry' ? t.quantity : -t.quantity), 
              0
            );
            
            return {
              date,
              totalQuantity,
              entries,
              exits
            };
          });
        },
        getProductMovement: (days = 30) => {
          const stockHistory = get().getStockHistory(days);
          
          return {
            entries: stockHistory.map(day => day.entries),
            exits: stockHistory.map(day => day.exits),
            labels: stockHistory.map(day => format(day.date, 'dd/MM'))
          };
        },
        getProductDwellTime: () => {
          const products = get().products;
          
          // Group products by how long they've been in stock
          const nowTime = new Date().getTime();
          const dwellTimeBuckets: Record<string, number> = {
            '1-7 dias': 0,
            '8-15 dias': 0,
            '16-30 dias': 0,
            '31-60 dias': 0,
            '60+ dias': 0
          };
          
          products.forEach(product => {
            if (product.quantity > 0) {
              const daysDiff = Math.floor((nowTime - product.createdAt.getTime()) / (1000 * 60 * 60 * 24));
              
              if (daysDiff <= 7) dwellTimeBuckets['1-7 dias'] += product.quantity;
              else if (daysDiff <= 15) dwellTimeBuckets['8-15 dias'] += product.quantity;
              else if (daysDiff <= 30) dwellTimeBuckets['16-30 dias'] += product.quantity;
              else if (daysDiff <= 60) dwellTimeBuckets['31-60 dias'] += product.quantity;
              else dwellTimeBuckets['60+ dias'] += product.quantity;
            }
          });
          
          return {
            labels: Object.keys(dwellTimeBuckets),
            data: Object.values(dwellTimeBuckets)
          };
        }
      }),
      {
        name: 'products-storage',
      }
    )
  )
);