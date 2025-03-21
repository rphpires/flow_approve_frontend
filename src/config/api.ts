// Configuração da API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Verificar se a URL da API está definida
if (!API_URL && typeof window !== 'undefined') {
  console.warn('A URL da API não está definida. Verifique se a variável de ambiente NEXT_PUBLIC_API_URL está configurada.');
}

// Funções auxiliares para requisições HTTP
export const fetchApi = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_URL}${endpoint}`;
  
  // Configuração padrão para as requisições
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Pegar o token de autenticação do localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      defaultOptions.headers = {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
  }

  // Mesclar as opções
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, fetchOptions);
    
    // Verificar se a resposta é um JSON válido
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    // Converter resposta para JSON ou texto
    const data = isJson ? await response.json() : await response.text();
    
    // Verificar se houve erro na requisição
    if (!response.ok) {
      throw new Error(isJson && data.message ? data.message : 'Ocorreu um erro na requisição');
    }
    
    return data as T;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};