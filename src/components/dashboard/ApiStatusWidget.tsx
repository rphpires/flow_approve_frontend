"use client";

import { useState, useEffect } from 'react';
import Card from "../ui/Card";
import { API_URL } from '@/config/api';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';

const ApiStatusWidget = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [showDetails, setShowDetails] = useState(false);
  const { authBypassEnabled } = useAuth();

  useEffect(() => {
    const checkApiStatus = async () => {
      if (!API_URL) {
        setStatus('offline');
        return;
      }

      try {
        await authService.healthCheck();
        setStatus('online');
      } catch (error) {
        console.error('Erro ao verificar status da API:', error);
        setStatus('offline');
      }
    };

    checkApiStatus();
    
    // Verificar a cada 30 segundos
    const interval = setInterval(checkApiStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Se estiver online e não houver detalhes abertos, não mostra nada
  if (status === 'online' && !showDetails) {
    return null;
  }

  return (
    <Card className={`
      ${status === 'online' ? 'bg-green-50 border-green-200' : 
        status === 'offline' ? 'bg-red-50 border-red-200' : 
        'bg-yellow-50 border-yellow-200'}
      mb-6
    `}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full mr-2 ${
            status === 'online' ? 'bg-green-500' : 
            status === 'offline' ? 'bg-red-500' : 
            'bg-yellow-500 animate-pulse'
          }`}></div>
          <h3 className={`font-medium ${
            status === 'online' ? 'text-green-700' : 
            status === 'offline' ? 'text-red-700' : 
            'text-yellow-700'
          }`}>
            {status === 'online' ? 'API Online' : 
             status === 'offline' ? 'API Offline' : 
             'Verificando conexão com a API...'}
          </h3>
        </div>
        
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-neutral-600 hover:text-neutral-800"
        >
          {showDetails ? 'Esconder detalhes' : 'Ver detalhes'}
        </button>
      </div>
      
      {showDetails && (
        <div className="mt-4 text-sm">
          <div className="mb-2">
            <strong>URL da API:</strong> {API_URL || 'Não configurada'}
          </div>
          
          {authBypassEnabled && (
            <div className="p-2 bg-blue-100 rounded-md text-blue-800 mt-2">
              <p className="font-medium">Modo de desenvolvimento: Bypass de autenticação ativado</p>
              <p>A verificação de credenciais está desativada. Para desabilitar, configure a variável de ambiente:</p>
              <pre className="bg-white p-2 rounded-md mt-1 overflow-x-auto">
                NEXT_PUBLIC_SKIP_AUTH=false
              </pre>
            </div>
          )}
          
          {!API_URL && (
            <div className="p-2 bg-yellow-100 rounded-md text-yellow-800 mt-2">
              <p className="font-medium">A URL da API não está configurada.</p>
              <p>Para configurar, crie um arquivo <code>.env.local</code> na raiz do projeto com o seguinte conteúdo:</p>
              <pre className="bg-white p-2 rounded-md mt-1 overflow-x-auto">
                NEXT_PUBLIC_API_URL=http://localhost:3001/api
              </pre>
            </div>
          )}
          
          {status === 'offline' && API_URL && !authBypassEnabled && (
            <div className="p-2 bg-red-100 rounded-md text-red-800 mt-2">
              <p className="font-medium">Não foi possível conectar-se à API.</p>
              <p>Verifique se o servidor da API está em execução na URL configurada.</p>
            </div>
          )}
          
          {status === 'online' && (
            <div className="p-2 bg-green-100 rounded-md text-green-800 mt-2">
              <p className="font-medium">Conexão com a API estabelecida com sucesso.</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ApiStatusWidget;