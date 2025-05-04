import { useEffect } from 'react';
import AuthForm from '@/components/ui/AuthForm';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  
  // Redirecionamento simples - em uma implementação real com roteamento,
  // usaríamos um hook de navegação (como useNavigate do React Router)
  useEffect(() => {
    if (isLoggedIn) {
      // Simula redirecionamento para o dashboard
      window.location.href = '/';
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <AuthForm />
    </div>
  );
}