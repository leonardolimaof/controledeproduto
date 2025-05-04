import { useProductStore } from '@/store/useProductStore';
import { useState } from 'react';
import { StockLineChart } from '@/components/ui/StockLineChart';
import { ProductMovementChart } from '@/components/ui/ProductMovementChart';
import { ProductDwellTimeChart } from '@/components/ui/ProductDwellTimeChart';

export default function DashboardPage() {
  const products = useProductStore((state) => state.products);
  const getStockHistory = useProductStore((state) => state.getStockHistory);
  const getProductMovement = useProductStore((state) => state.getProductMovement);
  const getProductDwellTime = useProductStore((state) => state.getProductDwellTime);
  
  const [timeRange, setTimeRange] = useState<number>(30);
  
  const totalProducts = products.length;
  const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
  const lowStockProducts = products.filter(product => product.quantity < 10).length;
  
  // Get data for charts
  const stockHistory = getStockHistory(timeRange);
  const productMovement = getProductMovement(timeRange);
  const dwellTimeData = getProductDwellTime();

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(Number(e.target.value));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total de Produtos */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total de Produtos
          </h2>
          <p className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">
            {totalProducts}
          </p>
        </div>
        
        {/* Quantidade Total em Estoque */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Qtd. Total em Estoque
          </h2>
          <p className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">
            {totalItems}
          </p>
        </div>
        
        {/* Produtos com Estoque Baixo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Produtos com Estoque Baixo
          </h2>
          <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
            {lowStockProducts}
          </p>
        </div>
      </div>

      {/* Time range selector */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex items-center">
          <label htmlFor="time-range" className="mr-2 text-sm text-gray-600 dark:text-gray-300">
            Período:
          </label>
          <select
            id="time-range"
            value={timeRange}
            onChange={handleRangeChange}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">7 dias</option>
            <option value="14">14 dias</option>
            <option value="30">30 dias</option>
          </select>
        </div>
      </div>
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Stock Over Time Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
            Evolução do Estoque
          </h2>
          {stockHistory.length > 0 ? (
            <StockLineChart stockData={stockHistory} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400 h-80 flex items-center justify-center">
              Sem dados para exibir
            </p>
          )}
        </div>
        
        {/* Entry/Exit Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
            Entradas e Saídas
          </h2>
          {productMovement.labels.length > 0 ? (
            <ProductMovementChart 
              entries={productMovement.entries} 
              exits={productMovement.exits} 
              labels={productMovement.labels}
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400 h-80 flex items-center justify-center">
              Sem dados para exibir
            </p>
          )}
        </div>
      </div>
      
      {/* Product Dwell Time Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          Tempo de Permanência em Estoque
        </h2>
        {products.length > 0 ? (
          <div className="max-w-xl mx-auto">
            <ProductDwellTimeChart
              labels={dwellTimeData.labels}
              data={dwellTimeData.data}
            />
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 h-80 flex items-center justify-center">
            Sem dados para exibir
          </p>
        )}
      </div>
      
      {/* Lista de produtos recentes */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          Produtos Recentes
        </h2>
        
        {products.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum produto cadastrado ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Código de Barras
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantidade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {product.barcode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {product.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}