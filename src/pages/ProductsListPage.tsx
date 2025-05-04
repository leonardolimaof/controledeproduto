import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, PlusIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { useProductStore } from '@/store/useProductStore';
import { Product } from '@/types/product';
import toast from 'react-hot-toast';
import { Dialog } from '@headlessui/react';
import ProductForm from '@/components/ui/ProductForm';
import TransactionForm from '@/components/ui/TransactionForm';

export default function ProductsListPage() {
  const products = useProductStore((state) => state.products);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const selectProduct = useProductStore((state) => state.selectProduct);

  // Estado para busca e paginação
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const productsPerPage = 10;

  // Filtragem e paginação dos produtos
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return products.filter((product) => 
      product.name.toLowerCase().includes(query) || 
      product.barcode.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  // Produtos da página atual
  const currentProducts = useMemo(() => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [filteredProducts, currentPage]);

  // Total de páginas
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Manipuladores de eventos
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset para a primeira página ao buscar
  };

  const handleEdit = (product: Product) => {
    selectProduct(product.id);
    setShowProductForm(true);
  };

  const handleDelete = (product: Product) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      deleteProduct(product.id);
      toast.success('Produto excluído com sucesso!');
    }
  };

  const handleAddNew = () => {
    selectProduct(null); // Limpa a seleção para criar um novo produto
    setShowProductForm(true);
  };

  const handleCloseForm = () => {
    setShowProductForm(false);
  };
  
  const handleAddTransaction = (product: Product) => {
    setSelectedProductId(product.id);
    setShowTransactionForm(true);
  };

  const handleCloseTransactionForm = () => {
    setShowTransactionForm(false);
    setSelectedProductId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Produtos
        </h1>
        <div className="space-x-2">
          <button
            onClick={() => {
              setSelectedProductId(null);
              setShowTransactionForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowDownIcon className="h-4 w-4 text-green-500 mr-2" />
            Registrar Movimento
          </button>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Produto
          </button>
        </div>
      </div>

      {/* Barra de busca */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800 dark:text-white"
            placeholder="Buscar produtos por nome ou código de barras"
          />
        </div>
      </div>

      {/* Tabela de produtos */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Última Atualização
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  {products.length === 0
                    ? 'Nenhum produto cadastrado. Adicione seu primeiro produto!'
                    : 'Nenhum produto encontrado com os critérios de busca.'}
                </td>
              </tr>
            ) : (
              currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {product.barcode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      product.quantity < 10
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {product.quantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleAddTransaction(product)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        title="Registrar movimento"
                      >
                        <ArrowDownIcon className="h-5 w-5" />
                        <span className="sr-only">Movimento</span>
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                        <span className="sr-only">Editar</span>
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Excluir"
                      >
                        <TrashIcon className="h-5 w-5" />
                        <span className="sr-only">Excluir</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span>
              Mostrando <span className="font-medium">{(currentPage - 1) * productsPerPage + 1}</span> a{' '}
              <span className="font-medium">
                {Math.min(currentPage * productsPerPage, filteredProducts.length)}
              </span>{' '}
              de <span className="font-medium">{filteredProducts.length}</span> resultados
            </span>
          </div>
          <nav className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-md"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-md"
            >
              Próximo
            </button>
          </nav>
        </div>
      )}

      {/* Modal para formulário de produto */}
      <Dialog 
        open={showProductForm} 
        onClose={handleCloseForm}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
          
          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 z-10">
            <ProductForm onClose={handleCloseForm} />
          </div>
        </div>
      </Dialog>

      {/* Modal para formulário de transação */}
      <Dialog 
        open={showTransactionForm} 
        onClose={handleCloseTransactionForm}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
          
          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 z-10">
            <TransactionForm 
              onClose={handleCloseTransactionForm} 
              initialProductId={selectedProductId || undefined} 
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}