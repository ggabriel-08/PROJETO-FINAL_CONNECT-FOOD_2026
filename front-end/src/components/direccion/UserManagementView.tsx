import React, { useState } from 'react';
import { Eye, Edit3, Power } from 'lucide-react';
import type { User } from '../../types';
import { Badge } from '../common/Badge';

interface UserManagementViewProps {
  users: User[];
  onToggleUserStatus: (userId: string) => void;
  onViewUser: (user: User) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  onToggleUserStatus,
  onViewUser,
}) => {
  const [filter, setFilter] = useState<'Todos' | 'Aluno' | 'Nutricionista' | 'Ativo' | 'Inativo'>('Todos');

  const filteredUsers = users.filter((u) => {
    if (filter === 'Todos') return true;
    if (filter === 'Aluno') return u.role === 'aluno';
    if (filter === 'Nutricionista') return u.role === 'nutricionista';
    if (filter === 'Ativo') return u.status === 'Ativo';
    if (filter === 'Inativo') return u.status === 'Inativo';
    return true;
  });

  const filterOptions: Array<'Todos' | 'Aluno' | 'Nutricionista' | 'Ativo' | 'Inativo'> = [
    'Todos',
    'Aluno',
    'Nutricionista',
    'Ativo',
    'Inativo',
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Gerenciamento de Usuários</h2>
      </div>

      {/* Filter Pills Bar */}
      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === opt
                ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                <th className="py-3.5 px-6">Nome</th>
                <th className="py-3.5 px-6">CPF</th>
                <th className="py-3.5 px-6">E-mail</th>
                <th className="py-3.5 px-6">Cargo</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Data de cadastro</th>
                <th className="py-3.5 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="py-4 px-6 font-semibold text-gray-900">{user.name}</td>
                  <td className="py-4 px-6 text-gray-500">{user.cpf}</td>
                  <td className="py-4 px-6 text-gray-600">{user.email}</td>
                  <td className="py-4 px-6 font-medium text-gray-800">{user.roleLabel}</td>
                  <td className="py-4 px-6">
                    <Badge variant={user.status === 'Ativo' ? 'active' : 'inactive'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-gray-500">{user.createdAt}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-500">
                      <button
                        onClick={() => onViewUser(user)}
                        className="hover:text-emerald-700 p-1 rounded-md transition-colors"
                        title="Visualizar usuário"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert(`Editar usuário ${user.name}`)}
                        className="hover:text-blue-600 p-1 rounded-md transition-colors"
                        title="Editar usuário"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onToggleUserStatus(user.id)}
                        className={`p-1 rounded-md transition-colors ${
                          user.status === 'Ativo'
                            ? 'hover:text-red-600 text-gray-400'
                            : 'text-emerald-600 hover:text-emerald-800'
                        }`}
                        title={user.status === 'Ativo' ? 'Desativar usuário' : 'Ativar usuário'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 text-xs">
                    Nenhum usuário encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
