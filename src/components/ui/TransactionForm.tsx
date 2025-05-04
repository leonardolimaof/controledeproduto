import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProductStore } from '@/store/useProductStore';
import { Product } from '@/types/product';
import toast from 'react-hot-toast';

// Schema de validação com Zod
const transactionSchema = z.object({
  productId: z.string().min(1, 'Produto é obrigatório'),
  type: z.enum(['entry', 'exit']),
  quantity: z.number().positive('Quantidade deve ser maior que zero').or(z.string().regex(/^[1-9]\d*$/).transform(Number)),
  reason: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onClose: () => void;
  initialProductId?: string;
}

export default function TransactionForm({ onClose, initialProductId }: TransactionFormProps) {
  const products = useProductStore((state) => state.products);
  const recordTransaction = useProductStore((state) => state.recordTransaction);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    initialProductId ? products.find(p => p.id === initialProductId) || null : null
  );
  
  // Configuração do react-hook-form com tipos corretos
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      productId: initialProductId || '',
      type: 'entry',
      quantity: 1,
      reason: '',
    },
  });

  const transactionType = watch('type');
  const watchedProductId = watch('productId');

  // Update selected product when productId changes
  if (watchedProductId && (!selectedProduct || selectedProduct.id !== watchedProductId)) {
    const newSelectedProduct = products.find(p => p.id === watchedProductId) || null;
    setSelectedProduct(newSelectedProduct);
  }

  const onSubmit = async (data: TransactionFormData) => {
    try {
      recordTransaction(
        data.productId,
        data.type,
        Number(data.quantity),
        data.reason
      );
      
      toast.success(
        data.type === 'entry' 
          ? 'Entrada registrada com sucesso!' 
          : 'Saída registrada com sucesso!'
      );
      
      onClose();
    } catch (error) {
      toast.error('Erro ao registrar transação');
      console.error(error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        Registrar {transactionType === 'entry' ? 'Entrada' : 'Saída'} de Produto
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Tipo de Transação
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                value="entry"
                {...register('type')}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Entrada</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                value="exit"
                {...register('type')}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Saída</span>
            </label>
          </div>
        </div>

        <div>
          <label
            htmlFor="productId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Produto
          </label>
          <select
            id="productId"
            className={`appearance-none block w-full px-3 py-2 border ${
              errors.productId
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
            {...register('productId')}
          >
            <option value="">Selecione um produto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.barcode}
              </option>
            ))}
          </select>
          {errors.productId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.productId.message}
            </p>
          )}
        </div>

        {selectedProduct && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Quantidade atual em estoque: <span className="font-semibold">{selectedProduct.quantity}</span>
            </p>
          </div>
        )}

        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Quantidade
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            className={`appearance-none block w-full px-3 py-2 border ${
              errors.quantity
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
            {...register('quantity')}
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.quantity.message}
            </p>
          )}
          {transactionType === 'exit' && selectedProduct && Number(watch('quantity')) > selectedProduct.quantity && (
            <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
              Atenção: Quantidade para saída é maior que o estoque disponível ({selectedProduct.quantity})
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Motivo (opcional)
          </label>
          <textarea
            id="reason"
            rows={2}
            className={`appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
            placeholder={transactionType === 'entry' ? "Ex: Compra de fornecedor" : "Ex: Venda para cliente"}
            {...register('reason')}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Registrando...' : 'Registrar'}
          </button>
        </div>
      </form>
    </div>
  );
}