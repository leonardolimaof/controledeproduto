import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProductStore } from '@/store/useProductStore';
import toast from 'react-hot-toast';

// Schema de validação com Zod
const productSchema = z.object({
  name: z.string().min(1, 'Nome do produto é obrigatório'),
  barcode: z.string().min(1, 'Código de barras é obrigatório'),
  quantity: z
    .number()
    .min(0, 'Quantidade não pode ser negativa')
    .or(z.string().regex(/^\d+$/).transform(Number)),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onClose: () => void;
}

export default function ProductForm({ onClose }: ProductFormProps) {
  const selectedProduct = useProductStore((state) => state.selectedProduct);
  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  
  // Configuração do react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      barcode: '',
      quantity: 0,
    },
  });

  // Preenche o formulário quando há um produto selecionado (edição)
  useEffect(() => {
    if (selectedProduct) {
      setValue('name', selectedProduct.name);
      setValue('barcode', selectedProduct.barcode);
      setValue('quantity', selectedProduct.quantity);
    } else {
      reset();
    }
  }, [selectedProduct, setValue, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (selectedProduct) {
        updateProduct(selectedProduct.id, {
          name: data.name,
          barcode: data.barcode,
          quantity: Number(data.quantity),
        });
        toast.success('Produto atualizado com sucesso!');
      } else {
        addProduct({
          name: data.name,
          barcode: data.barcode,
          quantity: Number(data.quantity),
        });
        toast.success('Produto cadastrado com sucesso!');
      }
      onClose();
    } catch (error) {
      toast.error('Erro ao salvar produto');
      console.error(error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        {selectedProduct ? 'Editar Produto' : 'Novo Produto'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Nome do Produto
          </label>
          <input
            id="name"
            type="text"
            className={`appearance-none block w-full px-3 py-2 border ${
              errors.name
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
            placeholder="Nome do produto"
            {...register('name')}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="barcode"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Código de Barras
          </label>
          <input
            id="barcode"
            type="text"
            className={`appearance-none block w-full px-3 py-2 border ${
              errors.barcode
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
            placeholder="Código de barras"
            {...register('barcode')}
          />
          {errors.barcode && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.barcode.message}
            </p>
          )}
        </div>

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
            min="0"
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
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}