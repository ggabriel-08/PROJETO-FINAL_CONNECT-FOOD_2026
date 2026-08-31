import React from 'react';
import { UtensilsCrossed, User as UserIcon, LogOut } from 'lucide-react';
import type { User, DirecaoTab, NutriTab } from '../../types';

interface HeaderProps {
  user: User;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeTab,
  onSelectTab,
  onOpenProfile,
  onLogout,
}) => {
  const getSubTitle = () => {
    switch (user.role) {
      case 'direcao':
        return 'PAINEL DA DIREÇÃO';
      case 'nutricionista':
        return 'ÁREA DA NUTRICIONISTA';
      case 'aluno':
        return 'ÁREA DO ALUNO';
      default:
        return 'CONECTANDO SUA ESCOLA';
    }
  };

  const renderTabs = () => {
    if (user.role === 'direcao') {
      const tabs: { id: DirecaoTab; label: string }[] = [
        { id: 'painel', label: 'Painel' },
        { id: 'cadastrar-aluno', label: 'Cadastrar aluno' },
        { id: 'cadastrar-nutricionista', label: 'Cadastrar nutricionista' },
        { id: 'gerenciar-usuarios', label: 'Gerenciar usuários' },
        { id: 'fiscalizar-comentarios', label: 'Fiscalizar comentários' },
      ];

      return (
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          {tabs.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTab(t.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-200 text-emerald-900 shadow-sm font-semibold'
                    : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      );
    }

    if (user.role === 'nutricionista') {
      const tabs: { id: NutriTab; label: string }[] = [
        { id: 'gerenciar-cardapio', label: 'Gerenciar cardápio' },
        { id: 'comentarios', label: 'Comentários dos alunos' },
      ];

      return (
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTab(t.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-200 text-emerald-900 shadow-sm font-semibold'
                    : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <header className="bg-white border-b border-emerald-100/60 shadow-xs sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-emerald-900 leading-tight">
                Connect Food
              </h1>
              <span className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase block">
                {getSubTitle()}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center ml-4">{renderTabs()}</nav>
        </div>

        {/* Right: User Profile & Logout */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 text-left group hover:opacity-90 transition-opacity"
            title="Ver meu perfil"
          >
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-gray-800 group-hover:text-emerald-700">
                {user.name}
              </p>
              <p className="text-[10px] text-gray-500 capitalize">{user.roleLabel}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200 shadow-xs group-hover:scale-105 transition-transform">
              <UserIcon className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-600 px-2 py-1.5 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>

      {/* Mobile nav pills row */}
      <div className="md:hidden border-t border-gray-100 px-4 py-2 bg-emerald-50/50 flex overflow-x-auto gap-2">
        {renderTabs()}
      </div>
    </header>
  );
};
