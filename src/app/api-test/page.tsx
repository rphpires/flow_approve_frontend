"use client";

import { useState, useEffect } from 'react';
import { fetchApi } from '@/config/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// Interface para capturar os endpoints que serão testados
interface EndpointTest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: string;
  result: {
    status: 'idle' | 'loading' | 'success' | 'error';
    data?: any;
    error?: string;
  };
}

export default function ApiTestPage() {
  const [apiUrl, setApiUrl] = useState<string>(process.env.NEXT_PUBLIC_API_URL || '');
  const [endpoints, setEndpoints] = useState<EndpointTest[]>([
    {
      url: '/health',
      method: 'GET',
      result: { status: 'idle' }
    }
  ]);

  const testEndpoint = async (index: number) => {
    const endpoint = endpoints[index];
    
    // Atualizar o estado para mostrar o carregamento
    const updatedEndpoints = [...endpoints];
    updatedEndpoints[index] = {
      ...endpoint,
      result: { status: 'loading' }
    };
    setEndpoints(updatedEndpoints);

    try {
      // Preparar o corpo da requisição, se houver
      let options: RequestInit = {
        method: endpoint.method,
      };
      
      if (endpoint.body && ['POST', 'PUT'].includes(endpoint.method)) {
        options.body = endpoint.body;
        options.headers = {
          'Content-Type': 'application/json'
        };
      }

      // Fazer a requisição usando a função fetchApi
      const data = await fetchApi(endpoint.url, options);
      
      // Atualizar o estado com o resultado
      const newEndpoints = [...endpoints];
      newEndpoints[index] = {
        ...endpoint,
        result: { 
          status: 'success',
          data: JSON.stringify(data, null, 2)
        }
      };
      setEndpoints(newEndpoints);
    } catch (error: any) {
      // Atualizar o estado com o erro
      const newEndpoints = [...endpoints];
      newEndpoints[index] = {
        ...endpoint,
        result: { 
          status: 'error',
          error: error.message
        }
      };
      setEndpoints(newEndpoints);
    }
  };

  const addEndpoint = () => {
    setEndpoints([
      ...endpoints,
      {
        url: '',
        method: 'GET',
        result: { status: 'idle' }
      }
    ]);
  };

  const removeEndpoint = (index: number) => {
    const newEndpoints = [...endpoints];
    newEndpoints.splice(index, 1);
    setEndpoints(newEndpoints);
  };

  const updateEndpoint = (index: number, field: keyof EndpointTest, value: any) => {
    const newEndpoints = [...endpoints];
    newEndpoints[index] = {
      ...newEndpoints[index],
      [field]: value
    };
    setEndpoints(newEndpoints);
  };

  const testAllEndpoints = () => {
    endpoints.forEach((_, index) => testEndpoint(index));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Teste de Conexão com a API</h1>
      
      <Card className="mb-6">
        <div className="mb-4">
          <Input
            label="URL Base da API"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="http://localhost:3001/api"
            className="w-full"
          />
          <p className="text-sm text-neutral-500 mt-1">
            Esta é a URL base configurada para a API. Para alterar permanentemente, configure a variável de ambiente NEXT_PUBLIC_API_URL.
          </p>
          {!apiUrl && (
            <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded-md">
              <strong>Atenção:</strong> A URL da API não está configurada. Configure a variável de ambiente NEXT_PUBLIC_API_URL no arquivo .env.local ou defina uma URL acima.
            </div>
          )}
        </div>
      </Card>
      
      <div className="mb-4 flex justify-between">
        <Button onClick={testAllEndpoints}>Testar Todos os Endpoints</Button>
        <Button onClick={addEndpoint} variant="outline">Adicionar Endpoint</Button>
      </div>
      
      {endpoints.map((endpoint, index) => (
        <Card key={index} className="mb-4">
          <div className="flex flex-wrap items-end gap-4 mb-4">
            <div className="flex-1">
              <Input
                label="Endpoint"
                value={endpoint.url}
                onChange={(e) => updateEndpoint(index, 'url', e.target.value)}
                placeholder="/auth/login"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Método
              </label>
              <select
                value={endpoint.method}
                onChange={(e) => updateEndpoint(index, 'method', e.target.value)}
                className="px-3 py-2 border border-neutral-300 rounded-md shadow-sm"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => testEndpoint(index)} variant="primary" size="sm">
                Testar
              </Button>
              <Button onClick={() => removeEndpoint(index)} variant="outline" size="sm" className="text-red-600">
                Remover
              </Button>
            </div>
          </div>
          
          {(endpoint.method === 'POST' || endpoint.method === 'PUT') && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Corpo da Requisição (JSON)
              </label>
              <textarea
                value={endpoint.body || ''}
                onChange={(e) => updateEndpoint(index, 'body', e.target.value)}
                placeholder={`{\n  "email": "usuario@exemplo.com",\n  "password": "senha123"\n}`}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm h-32 font-mono text-sm"
              />
            </div>
          )}
          
          <div>
            <h3 className="font-medium mb-2">Resultado:</h3>
            
            {endpoint.result.status === 'idle' && (
              <p className="text-neutral-500">Ainda não testado</p>
            )}
            
            {endpoint.result.status === 'loading' && (
              <p className="text-blue-500">Carregando...</p>
            )}
            
            {endpoint.result.status === 'error' && (
              <div className="bg-red-50 p-3 rounded-md border border-red-200 text-red-700 font-mono text-sm">
                Erro: {endpoint.result.error}
              </div>
            )}
            
            {endpoint.result.status === 'success' && (
              <div className="bg-green-50 p-3 rounded-md border border-green-200 text-green-700 overflow-auto max-h-60 font-mono text-sm">
                <pre>{endpoint.result.data}</pre>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}