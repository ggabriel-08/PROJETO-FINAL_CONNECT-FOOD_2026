import React, { useState, useEffect } from 'react';
import { Trash2, Plus, CheckCircle2, Loader2, Package, Utensils } from 'lucide-react';
import type { DailyMealPlan } from '../../types';
import { api, type AlimentoItem } from '../../services/api';

interface MenuManagementViewProps {
  mealPlans: Record<string, DailyMealPlan>;
  onUpdateMealPlan: (day: string, mealType: 'breakfast' | 'lunch' | 'snack', items: string[]) => void;
}

export const MenuManagementView: React.FC<MenuManagementViewProps> = ({
  mealPlans,
  onUpdateMealPlan,
}) => {
  // State for registered products/alimentos fetched from MySQL
  const [alimentos, setAlimentos] = useState<AlimentoItem[]>([]);
  const [nomeProduto, setNomeProduto] = useState('');
  const [caloriasProduto, setCaloriasProduto] = useState('');
  
  // State for week/day/meal selection
  const [selectedDay, setSelectedDay] = useState('Segunda-feira');
  const [selectedMeal, setSelectedMeal] = useState<'Almoço' | 'Café da manhã' | 'Café da tarde'>('Almoço');

  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const getMealKey = (): 'breakfast' | 'lunch' | 'snack' => {
    if (selectedMeal === 'Café da manhã') return 'breakfast';
    if (selectedMeal === 'Café da tarde') return 'snack';
    return 'lunch';
  };

  // Fetch all registered products from MySQL on mount
  const fetchRegisteredProducts = async () => {
    try {
      const data = await api.getAlimentos();
      setAlimentos(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar produtos cadastrados:', err);
    }
  };

  useEffect(() => {
    fetchRegisteredProducts();
  }, []);

  // 1. Cadastrar Produto no Banco em AÇÃO ÚNICA (1 Clique)
  const handleCadastrarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNome = nomeProduto.trim();
    if (!cleanNome) return;

    setLoading(true);
    setErrorMsg('');
    setFeedbackMsg('');

    try {
      await api.createAlimento({
        nome: cleanNome,
        calorias: caloriasProduto ? Number(caloriasProduto) : undefined,
      });

      setNomeProduto('');
      setCaloriasProduto('');
      setFeedbackMsg(`Produto "${cleanNome}" cadastrado com sucesso no banco de dados!`);
      setTimeout(() => setFeedbackMsg(''), 3500);

      // Atualizar lista de produtos gravados no banco imediatamente
      await fetchRegisteredProducts();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao cadastrar produto no banco.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Excluir Produto do Banco em AÇÃO ÚNICA (1 Clique)
  const handleExcluirProduto = async (id: string, nome: string) => {
    setLoading(true);
    setErrorMsg('');
    setFeedbackMsg('');

    try {
      await api.deleteAlimento(id);
      setFeedbackMsg(`Produto "${nome}" excluído do banco de dados!`);
      setTimeout(() => setFeedbackMsg(''), 3500);

      // Atualizar lista de produtos gravados no banco imediatamente
      await fetchRegisteredProducts();

      // Atualizar lista local da refeição caso o produto excluído estivesse na lista
      const currentMealItems = mealPlans[selectedDay]?.[getMealKey()] || [];
      if (currentMealItems.includes(nome)) {
        const updatedMealItems = currentMealItems.filter((i) => i !== nome);
        await api.updateMealFoods(selectedDay, getMealKey(), updatedMealItems);
        onUpdateMealPlan(selectedDay, getMealKey(), updatedMealItems);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao excluir produto do banco.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Vincular / Desvincular produto da refeição em AÇÃO ÚNICA (1 Clique)
  const handleToggleProdutoNaRefeicao = async (produtoNome: string) => {
    const currentMealItems = mealPlans[selectedDay]?.[getMealKey()] || [];
    let updatedMealItems: string[];

    if (currentMealItems.includes(produtoNome)) {
      updatedMealItems = currentMealItems.filter((item) => item !== produtoNome);
    } else {
      updatedMealItems = [...currentMealItems, produtoNome];
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await api.updateMealFoods(selectedDay, getMealKey(), updatedMealItems);
      onUpdateMealPlan(selectedDay, getMealKey(), updatedMealItems);
      setFeedbackMsg(`Cardápio de ${selectedMeal} (${selectedDay}) atualizado no banco!`);
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao atualizar refeição no banco.');
    } finally {
      setLoading(false);
    }
  };

  const currentMealItems = mealPlans[selectedDay]?.[getMealKey()] || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Gerenciamento de Produtos e Cardápio</h2>
        <p className="text-xs text-gray-500 mt-1">
          Cadastre produtos diretamente no MySQL e monte as refeições escolares com 1 único clique.
        </p>
      </div>

      {/* Global Feedback Banner */}
      {feedbackMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 text-xs font-semibold rounded-xl animate-in fade-in">
          {errorMsg}
        </div>
      )}

      {/* SEÇÃO 1: CADASTRO E LISTAGEM DE PRODUTOS NO BANCO DE DADOS */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-gray-900">Produtos Cadastrados no Banco (MySQL)</h3>
          </div>
          <span className="text-xs font-semibold text-gray-500">
            Total: {alimentos.length} produtos
          </span>
        </div>

        {/* Formulario Unico de Cadastro Direto */}
        <form onSubmit={handleCadastrarProduto} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={nomeProduto}
            onChange={(e) => setNomeProduto(e.target.value)}
            placeholder="Nome do produto (ex: Suco de Maracujá)"
            className="sm:col-span-2 px-4 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={caloriasProduto}
              onChange={(e) => setCaloriasProduto(e.target.value)}
              placeholder="Kcal (opcional)"
              className="w-28 px-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !nomeProduto.trim()}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors whitespace-nowrap flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <span>Cadastrar Produto</span>
            </button>
          </div>
        </form>

        {/* Tabela / Lista de Produtos Cadastrados */}
        <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
          {alimentos.map((prod) => (
            <div key={prod.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{prod.nome}</span>
                {prod.calorias ? (
                  <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                    {prod.calorias} kcal
                  </span>
                ) : null}
              </div>

              <button
                disabled={loading}
                onClick={() => handleExcluirProduto(prod.id, prod.nome)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-medium transition-colors disabled:opacity-50"
                title="Excluir produto do banco"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir</span>
              </button>
            </div>
          ))}

          {alimentos.length === 0 && (
            <p className="py-6 text-center text-xs text-gray-400">
              Nenhum produto cadastrado no banco de dados MySQL.
            </p>
          )}
        </div>
      </div>

      {/* SEÇÃO 2: MONTAGEM DO CARDÁPIO DA SEMANA POR REFEIÇÃO */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-gray-900">Montagem do Cardápio Semanal</h3>
          </div>
          {loading && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Gravando no MySQL...</span>
            </div>
          )}
        </div>

        {/* Seletor de Dia e Refeição */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Dia da Semana</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Segunda-feira">Segunda-feira</option>
              <option value="Terça-feira">Terça-feira</option>
              <option value="Quarta-feira">Quarta-feira</option>
              <option value="Quinta-feira">Quinta-feira</option>
              <option value="Sexta-feira">Sexta-feira</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tipo de Refeição</label>
            <select
              value={selectedMeal}
              onChange={(e) =>
                setSelectedMeal(e.target.value as 'Almoço' | 'Café da manhã' | 'Café da tarde')
              }
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Almoço">Almoço</option>
              <option value="Café da manhã">Café da manhã</option>
              <option value="Café da tarde">Café da tarde</option>
            </select>
          </div>
        </div>

        {/* Seleção em 1 clique dos produtos para esta refeição */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-gray-700">
            Produtos incluídos em: <span className="text-emerald-700">{selectedMeal} ({selectedDay})</span>
          </h4>

          <div className="flex flex-wrap gap-2">
            {alimentos.map((prod) => {
              const isIncluded = currentMealItems.includes(prod.nome);
              return (
                <button
                  key={prod.id}
                  disabled={loading}
                  onClick={() => handleToggleProdutoNaRefeicao(prod.nome)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                    isIncluded
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span>{isIncluded ? '✓' : '+'}</span>
                  <span>{prod.nome}</span>
                </button>
              );
            })}

            {alimentos.length === 0 && (
              <p className="text-xs text-gray-400">
                Cadastre um produto acima para adicioná-lo ao cardápio.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
