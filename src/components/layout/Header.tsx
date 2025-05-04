import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/useAuthStore';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  // Use separate selectors to prevent unnecessary rerenders
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 right-0 z-30 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="px-4 py-2 lg:px-6 flex justify-between items-center ml-64">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Sistema de Controle de Produtos
        </h1>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
          
          {user && (
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none">
                <span className="sr-only">Abrir menu do usuário</span>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-2">
                    {user.avatar ? (
                      <img
                        className="rounded-full"
                        src={user.avatar}
                        alt={`${user.name}'s avatar`}
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span>{user.name}</span>
                </div>
              </Menu.Button>
              
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => navigate('/perfil')}
                          className={`${
                            active
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-900 dark:text-gray-300'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          Perfil
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`${
                            active
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-900 dark:text-gray-300'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          Sair
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>
      </div>
    </header>
  );
}