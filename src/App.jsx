import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsListPage from './pages/ProductsListPage';
import BarcodeScannerPage from './pages/BarcodeScannerPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';

// Componente para proteção de rotas
function ProtectedRoute({ children }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <>
      {/* Sistema de notificações */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#059669',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#DC2626',
            },
          },
        }}
      />
      
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/produtos" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ProductsListPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/scanner" 
            element={
              <ProtectedRoute>
                <Layout>
                  <BarcodeScannerPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/configuracoes" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ConfiguracoesPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Redirecionar para o dashboard por padrão */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;