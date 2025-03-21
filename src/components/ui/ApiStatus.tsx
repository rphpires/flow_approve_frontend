"use client";

import { useState, useEffect } from 'react';
import { API_URL } from '@/config/api';
import { authService } from '@/services/authService';

interface ApiStatusProps {
  showUrl?: boolean;
  className?: string;
}

const ApiStatus = ({ showUrl = false, className = '' }: ApiStatusProps) => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

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

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'API Online';
      case 'offline':
        return 'API Offline';
      default:
        return 'Verificando API...';
    }
  };

  if (!showUrl && status === 'online') {
    return null; // Não exibir nada se estiver online e showUrl for false
  }

  return (
    <div className={`rounded-md p-2 ${getStatusColor()} ${className}`}>
      <div className="flex items-center text-sm">
        <div className={`w-3 h-3 rounded-full mr-2 ${status === 'online' ? 'bg-green-500' : status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'}`} />
        <span>{getStatusText()}</span>
        {showUrl && (
          <span className="ml-2 opacity-75">
            {API_URL ? `(${API_URL})` : '(URL não configurada)'}
          </span>
        )}
      </div>
      {!API_URL && (
        <div className="mt-1 text-xs font-medium">
          Configure a variável NEXT_PUBLIC_API_URL no arquivo .env.local
        </div>
      )}
    </div>
  );
};

export default ApiStatus;