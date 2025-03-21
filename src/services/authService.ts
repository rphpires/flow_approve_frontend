import { fetchApi } from '@/config/api';
import { User } from '@/types';

interface LoginResponse {
  user: User;
  token: string;
}

// Verificar se a autenticação deve ser ignorada
const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === 'true';

// Token simulado para quando a autenticação é ignorada
const MOCK_TOKEN = 'mock-jwt-token-123456789';

export const authService = {
  // Função para login
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // Se SKIP_AUTH estiver habilitado, simula um login bem-sucedido
    if (SKIP_AUTH) {
      console.log('Auth bypass ativado: ignorando validação de credenciais');
      
      // Retorna um usuário simulado e um token falso
      return {
        user: {
          id: '1',
          name: 'Usuário Teste',
          email: email || 'teste@exemplo.com',
          role: 'admin'
        },
        token: MOCK_TOKEN
      };
    }
    
    // Caso contrário, faz a requisição real para a API
    return fetchApi<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  // Função para validar token atual
  validateToken: async (): Promise<User> => {
    // Se SKIP_AUTH estiver habilitado, simula uma validação bem-sucedida
    if (SKIP_AUTH) {
      // Verifica se há um email salvo no localStorage
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const email = storedUser ? JSON.parse(storedUser).email : 'teste@exemplo.com';
      
      return {
        id: '1',
        name: 'Usuário Teste',
        email,
        role: 'admin'
      };
    }
    
    // Caso contrário, faz a requisição real para a API
    return fetchApi<User>('/auth/me', {
      method: 'GET',
    });
  },
  
  // Função para logout (caso o backend precise ser notificado)
  logout: async (): Promise<void> => {
    // Se SKIP_AUTH estiver habilitado, não precisa fazer requisição
    if (SKIP_AUTH) {
      return;
    }
    
    try {
      await fetchApi('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Erro ao fazer logout', error);
      // Mesmo que falhe no backend, vamos limpar o localStorage
    }
  },
  
  // Função para verificar se a API está online
  healthCheck: async (): Promise<{ status: string }> => {
    // Se SKIP_AUTH estiver habilitado, simula que a API está online
    if (SKIP_AUTH) {
      return { status: 'ok' };
    }
    
    return fetchApi<{ status: string }>('/health', {
      method: 'GET',
    });
  }
};