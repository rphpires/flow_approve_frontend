export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }
  
  export interface Empresa {
    id: string;
    nome: string;
    cnpj: string;
    tipo: 'cliente' | 'prestador';
    status: 'ativo' | 'inativo';
  }
  
  export interface Documento {
    id: string;
    tipo: string;
    usuarioId: string;
    usuarioNome: string;
    dataValidade: string;
    status: 'pendente' | 'aprovado' | 'rejeitado';
  }
  
  export interface Atividade {
    id: string;
    descricao: string;
    empresaId: string;
    empresaNome: string;
    dataInicio: string;
    dataFim: string;
    status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  }