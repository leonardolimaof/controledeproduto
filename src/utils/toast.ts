import toast, { ToastOptions } from 'react-hot-toast';

// Configurações padrão para notificações
const defaultOptions: ToastOptions = {
  duration: 3000,
  position: 'top-right',
};

// Funções auxiliares para notificações
export const notification = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, { ...defaultOptions, ...options }),
  
  error: (message: string, options?: ToastOptions) =>
    toast.error(message, { 
      ...defaultOptions, 
      duration: 4000, // Erros ficam visíveis por mais tempo
      ...options 
    }),
  
  info: (message: string, options?: ToastOptions) =>
    toast(message, { ...defaultOptions, ...options }),
  
  loading: (message: string, options?: ToastOptions) =>
    toast.loading(message, { ...defaultOptions, ...options }),
  
  dismiss: toast.dismiss,
};

export default notification;