"use client";

import { useState, FormEvent, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { API_URL } from '@/config/api';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [error, setError] = useState('');
  
  const { login, error: authError, authBypassEnabled } = useAuth();

  // Verificar se a API está online ao montar o componente
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await authService.healthCheck();
        setApiStatus('online');
      } catch (err) {
        setApiStatus('offline');
        console.error('API não está disponível:', err);
      }
    };

    checkApiStatus();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Verificar se a API está online antes de tentar fazer login
      if (apiStatus === 'offline') {
        throw new Error('O servidor não está disponível no momento. Tente novamente mais tarde.');
      }
      
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao fazer login. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">Controle de Documentos Trabalhistas</h1>
        <p className="text-neutral-600">Faça login para acessar o sistema</p>
      </div>
      
      {authBypassEnabled && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">
          <p className="font-medium">Modo de desenvolvimento: Bypass de autenticação ativado</p>
          <p className="text-sm">As credenciais não serão verificadas. Qualquer email e senha serão aceitos.</p>
        </div>
      )}
      
      {apiStatus === 'offline' && !authBypassEnabled && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-md">
          O servidor não está disponível no momento. Tente novamente mais tarde.
        </div>
      )}
      
      {(error || authError) && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error || authError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            disabled={apiStatus === 'offline'}
          />
          
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            required
            disabled={apiStatus === 'offline'}
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || apiStatus === 'offline'}
          >
            {isLoading ? 'Carregando...' : 'Entrar'}
          </Button>
        </div>
      </form>
      
      <div className="mt-4 text-center text-sm">
        <div className={`inline-flex items-center px-3 py-1 rounded-full ${
          apiStatus === 'online' ? 'bg-green-100 text-green-800' : 
          apiStatus === 'offline' ? 'bg-red-100 text-red-800' : 
          'bg-yellow-100 text-yellow-800'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            apiStatus === 'online' ? 'bg-green-500' : 
            apiStatus === 'offline' ? 'bg-red-500' : 
            'bg-yellow-500'
          }`}></div>
          {apiStatus === 'online' ? 'API Online' : apiStatus === 'offline' ? 'API Offline' : 'Verificando API...'}
          {apiStatus === 'offline' && !API_URL && (
            <span className="ml-1">(URL não configurada)</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default LoginForm;