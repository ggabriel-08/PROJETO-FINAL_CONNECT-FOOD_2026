import React, { useState } from 'react';
import type { User } from '../../types';

interface NutritionistRegisterViewProps {
  onAddNutritionist: (
    newNutri: Omit<User, 'id' | 'createdAt'> & { password: string }
  ) => void;
}

export const NutritionistRegisterView: React.FC<NutritionistRegisterViewProps> = ({
  onAddNutritionist,
}) => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNutritionist({
    name,
    cpf,
    email,
    password,
    role: 'nutricionista',
    roleLabel: 'Nutricionista',
    status: 'Ativo',
  });

    setSuccessMsg(`Nutricionista ${name} cadastrada com sucesso!`);
    setName('');
    setCpf('');
    setEmail('');
    setPassword('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Cadastro de Nutricionista</h2>
        <p className="text-xs text-gray-500 mt-1">
          A nutricionista poderá editar apenas os alimentos dos cardápios.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-xl animate-in fade-in">
          {successMsg}
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nome completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Marina Alves"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="000.000.000-00"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nutri@sesi.com"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Senha inicial
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-6 py-3 rounded-full transition-all shadow-sm hover:shadow-md"
            >
              Cadastrar nutricionista
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
