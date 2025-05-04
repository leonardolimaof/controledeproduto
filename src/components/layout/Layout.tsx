import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ErrorBoundary from '../ui/ErrorBoundary';
import { useAuthStore } from '@/store/useAuthStore';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // Se não estiver logado, apenas renderiza o conteúdo (que será a página de login)
  if (!isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <ErrorBoundary>
        <Sidebar />
      </ErrorBoundary>
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
      <main className="pt-16 pb-6 ml-64 px-6">
        <ErrorBoundary>
          <div className="mt-6">
            {children}
          </div>
        </ErrorBoundary>
      </main>
    </div>
  );
}