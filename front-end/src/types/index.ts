export type UserRole = 'direcao' | 'nutricionista' | 'aluno';

export type UserStatus = 'Ativo' | 'Inativo';

export type CommentStatus = 'Ativo' | 'Removido';

export interface User {
  id: string;
  name: string;
  cpf: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  status: UserStatus;
  createdAt: string;
  schoolYear?: string;
  dietaryRestriction?: string;
}

export interface CommentItem {
  id: string;
  studentName: string;
  comment: string;
  date: string;
  menuInfo: string;
  status: CommentStatus;
  removalReason?: string;
}

export interface MenuItem {
  id: string;
  name: string;
}

export interface DailyMealPlan {
  dayOfWeek: string; // 'Segunda-feira', 'Terça-feira', etc.
  breakfast: string[];
  lunch: string[];
  snack: string[];
}

export type DirecaoTab = 'painel' | 'cadastrar-aluno' | 'cadastrar-nutricionista' | 'gerenciar-usuarios' | 'fiscalizar-comentarios';
export type NutriTab = 'gerenciar-cardapio' | 'comentarios';
export type AlunoTab = 'cardapio';
