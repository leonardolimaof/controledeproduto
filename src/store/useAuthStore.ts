import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AuthState, User } from '@/types/user';

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

// Using a stable and consistent selector pattern
export const useAuthStore = create<
  AuthState & {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setUser: (user: User) => void;
  }
>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        login: async (email: string, password: string) => {
          // Don't set state if we're already loading to prevent unnecessary updates
          if (get().isLoading) return;
          
          set({ isLoading: true, error: null });
          
          try {
            // Mock login - in real app, this would be an API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            
            // Check fake credentials (replace with real auth later)
            if (email === 'admin@example.com' && password === 'password') {
              const user: User = {
                id: '1',
                name: 'Admin User',
                email: 'admin@example.com',
                avatar: '',
              };
              
              // Use function update to safely merge state
              set(() => ({ 
                user, 
                isLoggedIn: true, 
                isLoading: false
              }));
            } else {
              set(() => ({ error: 'Credenciais inválidas', isLoading: false }));
            }
          } catch (error) {
            set(() => ({ error: 'Erro ao fazer login', isLoading: false }));
          }
        },
        logout: () => {
          // Using a function to update state is more reliable
          set(() => initialState);
        },
        setUser: (user) => {
          set(() => ({ user, isLoggedIn: true }));
        }
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ 
          user: state.user, 
          isLoggedIn: state.isLoggedIn 
        }),
      }
    )
  )
);