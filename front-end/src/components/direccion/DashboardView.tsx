import React from 'react';
import { ShieldCheck, GraduationCap, UserPlus, Users, MessageSquare } from 'lucide-react';
import type { DirecaoTab } from '../../types';

interface DashboardViewProps {
  studentCount: number;
  nutriCount: number;
  activeCommentsCount: number;
  removedCommentsCount: number;
  onNavigate: (tab: DirecaoTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  studentCount,
  nutriCount,
  activeCommentsCount,
  removedCommentsCount,
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      {/* Title section */}
      <div className="flex items-start gap-2.5">
        <ShieldCheck className="w-7 h-7 text-emerald-700 mt-1 shrink-0" />
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Painel da Direção</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Administração de usuários e moderação do Connect Food.
          </p>
        </div>
      </div>

      {/* Top 4 Stat Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
            TOTAL DE ALUNOS
          </p>
          <p className="text-3xl font-black text-emerald-700 mt-2">{studentCount}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
            TOTAL DE NUTRICIONISTAS
          </p>
          <p className="text-3xl font-black text-emerald-700 mt-2">{nutriCount}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
            COMENTÁRIOS ATIVOS
          </p>
          <p className="text-3xl font-black text-emerald-700 mt-2">{activeCommentsCount}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
            COMENTÁRIOS REMOVIDOS
          </p>
          <p className="text-3xl font-black text-emerald-700 mt-2">{removedCommentsCount}</p>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Cadastrar Aluno */}
        <button
          onClick={() => onNavigate('cadastrar-aluno')}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all text-left group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
              Cadastrar Aluno
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Novo aluno com ano escolar e restrições alimentares.
            </p>
          </div>
        </button>

        {/* Card 2: Cadastrar Nutricionista */}
        <button
          onClick={() => onNavigate('cadastrar-nutricionista')}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all text-left group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
              Cadastrar Nutricionista
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Conceda acesso à gestão do cardápio.
            </p>
          </div>
        </button>

        {/* Card 3: Gerenciar Usuários */}
        <button
          onClick={() => onNavigate('gerenciar-usuarios')}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all text-left group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
              Gerenciar Usuários
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Visualize, edite e desative contas.
            </p>
          </div>
        </button>

        {/* Card 4: Fiscalizar Comentários */}
        <button
          onClick={() => onNavigate('fiscalizar-comentarios')}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all text-left group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
              Fiscalizar Comentários
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Modere e remova comentários inadequados.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
