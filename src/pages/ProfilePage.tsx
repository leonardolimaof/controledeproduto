import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import toast from '@/utils/toast';

export default function ProfilePage() {
  // Use seletores separados para evitar re-renderizações desnecessárias
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);

  // Inicialize o formData com valores vazios
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Sincronize o formData apenas quando o usuário mudar ou quando entrar/sair do modo de edição
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || ''
      }));
    }
  }, [user]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Atualize apenas os campos de perfil (sem senha)
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar
    };
    
    setUser(updatedUser);
    setIsEditing(false);
    toast.success('Perfil atualizado com sucesso!');
  }, [user, formData, setUser]);

  const handlePasswordChange = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (formData.newPassword.length < 6) {
      return toast.error('A nova senha deve ter pelo menos 6 caracteres');
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error('As senhas não coincidem');
    }

    toast.success('Senha atualizada com sucesso!');
    setIsChangingPassword(false);
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  }, [formData]);

  const handleCancelEdit = useCallback(() => {
    if (!user) return;
    
    setIsEditing(false);
    // Restaurar valores originais
    setFormData(prev => ({
      ...prev,
      name: user.name,
      email: user.email,
      avatar: user.avatar || ''
    }));
  }, [user]);

  const handleCancelPasswordChange = useCallback(() => {
    setIsChangingPassword(false);
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  }, []);

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.name}'s avatar`}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-medium text-gray-600 dark:text-gray-300">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{user.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Formulário de edição de perfil */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Informações do Perfil</h2>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Editar
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL da foto de perfil
                </label>
                <input
                  type="url"
                  name="avatar"
                  id="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Deixe em branco para usar as iniciais do seu nome
                </p>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Salvar Alterações
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Nome</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{user.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{user.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Função</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">Administrador</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Último acesso</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">3 de maio de 2025</dd>
              </div>
            </dl>
          )}
        </div>

        {/* Seção de alteração de senha */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Segurança</h2>
            {!isChangingPassword && (
              <button
                type="button"
                onClick={() => setIsChangingPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Alterar Senha
              </button>
            )}
          </div>

          {isChangingPassword ? (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Senha Atual
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nova Senha
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Atualizar Senha
                </button>
                <button
                  type="button"
                  onClick={handleCancelPasswordChange}
                  className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>• Sua senha foi alterada pela última vez há 30 dias</p>
              <p>• Ative a autenticação de dois fatores para aumentar a segurança da sua conta</p>
            </div>
          )}
        </div>

        {/* Seção de atividade da conta */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Atividade da Conta</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Login bem-sucedido
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  3 de maio de 2025, 09:15
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                  Sucesso
                </span>
              </div>
            </div>

            <div className="flex items-start">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Perfil atualizado
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  1 de maio de 2025, 14:30
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                  Alteração
                </span>
              </div>
            </div>

            <div className="flex items-start">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Senha alterada
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  3 de abril de 2025, 11:45
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                  Segurança
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}