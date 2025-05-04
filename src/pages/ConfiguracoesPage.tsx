export default function ConfiguracoesPage() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Configurações do Sistema</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Configurações Gerais</h2>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Notificações por e-mail</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receber alertas sobre níveis baixos de estoque</p>
              </div>
              <div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Modo escuro</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Alternar entre tema claro e escuro</p>
              </div>
              <div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Informações da Empresa</h2>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome da empresa
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                placeholder="Star Print Tecnologia"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CNPJ
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                placeholder="00.000.000/0001-00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Endereço
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                placeholder="Rua Exemplo, 123"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Salvar Configurações
        </button>
      </div>
    </div>
  );
}