import { NextResponse } from 'next/server';
import { User } from '@/types';

interface LoginRequest {
  email: string;
  password: string;
}

// Esta é uma API simulada para autenticação
// Será implementada com a integração real posteriormente

export async function POST(request: Request) {
  try {
    const body = await request.json() as LoginRequest;
    const { email, password } = body;
    
    // Aqui seria feita a validação real das credenciais
    // Por enquanto, vamos apenas simular um login bem-sucedido
    
    // Verificação básica para garantir que os campos foram preenchidos
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Simulação de um usuário autenticado
    const user: User = {
      id: '1',
      name: 'Usuário Teste',
      email,
      role: 'admin'
    };
    
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
}