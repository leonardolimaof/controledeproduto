import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  TagIcon, 
  QrCodeIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/useAuthStore';

type NavItem = {
  name: string;
  icon: React.ReactElement;
  path: string;
};

const navigation: NavItem[] = [
  { name: 'Dashboard', icon: <HomeIcon className="h-6 w-6" />, path: '/' },
  { name: 'Produtos', icon: <TagIcon className="h-6 w-6" />, path: '/produtos' },
  { name: 'Leitor de Código', icon: <QrCodeIcon className="h-6 w-6" />, path: '/scanner' },
  { name: 'Configurações', icon: <Cog6ToothIcon className="h-6 w-6" />, path: '/configuracoes' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen transition-width duration-300 ease-in-out 
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        ${collapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            {!collapsed && (
              <span className="text-lg font-semibold text-gray-800 dark:text-white">
                Controle de Estoque
              </span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {collapsed ? (
                <ChevronRightIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronLeftIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>

          <div className="py-4 overflow-y-auto">
            <ul className="space-y-2 px-3">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      location.pathname === item.path
                        ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <span className="ml-3 flex-1 whitespace-nowrap">{item.name}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {!collapsed && user && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
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
              </div>
              <div className="ml-3 truncate">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}