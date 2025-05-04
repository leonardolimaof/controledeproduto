import { useState } from 'react';
import BarcodeScanner from '@/components/ui/BarcodeScanner';
import ProductForm from '@/components/ui/ProductForm';
import { useProductStore } from '@/store/useProductStore';
import { Product } from '@/types/product';
import { Dialog } from '@headlessui/react';

export default function BarcodeScannerPage() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const selectProduct = useProductStore((state) => state.selectProduct);
  const selectedProduct = useProductStore((state) => state.selectedProduct);

  const handleScanSuccess = (barcode: string, product?: Product) => {
    setScannedBarcode(barcode);
    
    if (product) {
      // Se o produto existe, seleciona ele para visualização/edição
      selectProduct(product.id);
    } else {
      // Se o produto não existe, limpa a seleção para criar um novo
      selectProduct(null);
      setShowProductForm(true); // Abre o formulário para cadastro
    }
  };

  const handleCloseForm = () => {
    setShowProductForm(false);
    selectProduct(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Leitor de Código de Barras
      </h1>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6 mb-6">
        <BarcodeScanner onScanSuccess={handleScanSuccess} />
      </div>

      {/* Modal para edição/cadastro de produto */}
      <Dialog 
        open={showProductForm} 
        onClose={handleCloseForm}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          
          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 z-10">
            {selectedProduct ? (
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white p-6 pb-0">
                Editar Produto
              </Dialog.Title>
            ) : (
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white p-6 pb-0">
                Novo Produto
                {scannedBarcode && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Código de barras escaneado: {scannedBarcode}
                  </p>
                )}
              </Dialog.Title>
            )}
            
            <div className="p-6">
              <ProductForm onClose={handleCloseForm} />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}