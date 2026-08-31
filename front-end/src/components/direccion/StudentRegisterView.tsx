import React, { useState } from 'react';
import type { User } from '../../types';

interface StudentRegisterViewProps {
  onAddStudent: (
    newStudent: Omit<User, 'id' | 'createdAt'> & { password: string }
  ) => void;
}

export const StudentRegisterView: React.FC<StudentRegisterViewProps> = ({ onAddStudent }) => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolYear, setSchoolYear] = useState('1º ano');
  const [hasRestriction, setHasRestriction] = useState<boolean>(false);
  const [restrictionText, setRestrictionText] = useState('Intolerância à lactose');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStudent({
    name,
    cpf: cpf || '...***-00',
    email,
    password,
    role: 'aluno',
    roleLabel: 'Aluno',
    status: 'Ativo',
    schoolYear,
    dietaryRestriction: hasRestriction ? restrictionText : 'Sem restrição',
  });

    setSuccessMsg(`Aluno(a) ${name} cadastrado(a) com sucesso!`);
    setName('');
    setCpf('');
    setEmail('');
    setPassword('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Cadastro de Aluno</h2>
        <p className="text-xs text-gray-500 mt-1">
          A restrição alimentar definida aqui gera automaticamente o cardápio adaptado do aluno.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-xl animate-in fade-in">
          {successMsg}
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nome completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Ana Beatriz Souza"
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
                placeholder="aluno@sesi.com"
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

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Ano escolar
              </label>
              <select
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="1º ano">1º ano</option>
                <option value="2º ano">2º ano</option>
                <option value="3º ano">3º ano</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Possui restrição alimentar?
              </label>
              <div className="flex items-center gap-6 text-xs font-medium text-gray-700 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="restriction"
                    checked={hasRestriction === true}
                    onChange={() => setHasRestriction(true)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Sim</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="restriction"
                    checked={hasRestriction === false}
                    onChange={() => setHasRestriction(false)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Não</span>
                </label>
              </div>
            </div>
          </div>

          {hasRestriction && (
            <div className="pt-2 animate-in fade-in">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Descrição da Restrição Alimentar
              </label>
              <input
                type="text"
                value={restrictionText}
                onChange={(e) => setRestrictionText(e.target.value)}
                placeholder="Ex: Intolerância à lactose, Alergia a amendoim..."
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/30"
              />
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-6 py-3 rounded-full transition-all shadow-sm hover:shadow-md"
            >
              Cadastrar aluno
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
