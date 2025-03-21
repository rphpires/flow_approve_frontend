"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { authService } from '@/services/authService';

// Verificar se a autenticação deve ser ignorada
const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === 'true';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  authBypassEnabled: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Função para verificar se o token é válido ao iniciar a aplicação
  useEffect(() => {
    const validateAuth = async () => {
      setLoading(true);
      try {
        // Verificar se há token no localStorage
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Validar o token com o backend
        const userData = await authService.validateToken();
        setUser(userData);
      } catch (err) {
        console.error('Erro ao validar token:', err);
        // Se houver erro, limpar o localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    validateAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);
    
    try {
      // Chamar o serviço de autenticação
      const response = await authService.login(email, password);
      
      // Salvar token e dados do usuário
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      router.push('/dashboard');
      return response.user;
    } catch (err: any) {
      console.error('Erro ao fazer login:', err);
      setError(err.message || 'Falha ao realizar login. Verifique suas credenciais.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Chamar o serviço de logout, apenas se a URL da API estiver configurada
      if (process.env.NEXT_PUBLIC_API_URL) {
        await authService.logout();
      }
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      // Limpar dados do usuário e token
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      router.push('/');
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error, authBypassEnabled: SKIP_AUTH }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);