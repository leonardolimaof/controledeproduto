import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/useAuthStore';

// Schema de validação com Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('Formato de e-mail inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    await login(data.email, data.password);
    setIsLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sistema de Controle de Produtos
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Por favor, faça login para continuar
        </p>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={`appearance-none block w-full px-3 py-2 border ${
              errors.email
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
            placeholder="seu@email.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className={`appearance-none block w-full px-3 py-2 border ${
              errors.password
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
            placeholder="••••••••"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>

        <div className="text-sm text-center text-gray-600 dark:text-gray-400">
          <p>Credenciais de demonstração:</p>
          <p>Email: admin@example.com / Senha: password</p>
        </div>
      </form>
    </div>
  );
}