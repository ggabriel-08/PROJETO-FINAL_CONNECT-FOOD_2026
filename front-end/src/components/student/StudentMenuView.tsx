import React, { useState, useEffect } from 'react';
import { Coffee, UtensilsCrossed, Cookie } from 'lucide-react';
import type { DailyMealPlan, CommentItem } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { api } from '../../services/api';

interface StudentMenuViewProps {
  studentName?: string;
  dietaryRestriction?: string;
  mealPlans: Record<string, DailyMealPlan>;
  comments: CommentItem[];
  onAddComment: (commentText: string) => void;
}

export const StudentMenuView: React.FC<StudentMenuViewProps> = ({
  dietaryRestriction = 'Sem restrição',
  mealPlans,
  comments,
  onAddComment,
}) => {
  const [selectedDay, setSelectedDay] = useState('Segunda-feira');
  const [commentText, setCommentText] = useState('');
  const [userRating, setUserRating] = useState<number>(0);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [loadingRating, setLoadingRating] = useState(false);

  const days = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];
  const currentPlan = mealPlans[selectedDay] || {
    breakfast: [],
    lunch: [],
    snack: [],
  };

  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        const data = await api.getAvaliacoes();
        setUserRating(data.userRating || 0);
        setSelectedRating(data.userRating || 0);
        setAvgRating(data.averageRating || 0);
      } catch (err) {
        console.error('Erro ao carregar avaliações:', err);
      }
    };
    fetchRatingData();
  }, []);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText.trim());
    setCommentText('');
    setCommentSubmitted(true);
    setTimeout(() => setCommentSubmitted(false), 3000);
  };

  const handleSendRating = async () => {
    if (selectedRating < 1 || selectedRating > 5) return;
    setLoadingRating(true);
    try {
      await api.submitAvaliacao(selectedRating);
      setUserRating(selectedRating);
      setRatingSubmitted(true);
      setTimeout(() => setRatingSubmitted(false), 3000);
      
      const updatedStats = await api.getAvaliacoes();
      setAvgRating(updatedStats.averageRating || 0);
    } catch (err: any) {
      alert(err.message || 'Erro ao enviar avaliação');
    } finally {
      setLoadingRating(false);
    }
  };

  const activeComments = comments.filter((c) => c.status === 'Ativo');

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Title & Adapted Menu Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Cardápio da Semana</h2>
          <p className="text-xs text-gray-500 mt-0.5">Semana Atual — Consultada em Tempo Real no Banco</p>
        </div>

        {dietaryRestriction && (
          <div className="px-4 py-2 bg-amber-50 border border-amber-200/80 rounded-full text-xs font-semibold text-amber-900 shadow-2xs self-start md:self-auto">
            Cardápio adaptado para: <span className="font-bold">{dietaryRestriction}</span>
          </div>
        )}
      </div>

      {/* Days Selection Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {days.map((day) => {
          const isActive = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-5 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* 3 Meal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Café da manhã */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-amber-100/70 text-amber-800 flex items-center justify-center">
                <Coffee className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Café da manhã</h3>
            </div>

            <ul className="space-y-2.5 text-xs text-gray-700 font-medium">
              {currentPlan.breakfast.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>{item}</span>
                </li>
              ))}
              {currentPlan.breakfast.length === 0 && (
                <li className="text-gray-400 italic">Nenhum registro no banco.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Almoço */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-amber-100/70 text-amber-800 flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Almoço</h3>
            </div>

            <ul className="space-y-2.5 text-xs text-gray-700 font-medium">
              {currentPlan.lunch.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>{item}</span>
                </li>
              ))}
              {currentPlan.lunch.length === 0 && (
                <li className="text-gray-400 italic">Nenhum registro no banco.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Café da tarde */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-amber-100/70 text-amber-800 flex items-center justify-center">
                <Cookie className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Café da tarde</h3>
            </div>

            <ul className="space-y-2.5 text-xs text-gray-700 font-medium">
              {currentPlan.snack.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>{item}</span>
                </li>
              ))}
              {currentPlan.snack.length === 0 && (
                <li className="text-gray-400 italic">Nenhum registro no banco.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Section: Avaliação com Estrelas */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900">Como você avalia o cardápio?</h3>
          {avgRating > 0 && (
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Média geral do cardápio: ★ {avgRating} / 5
            </span>
          )}
        </div>

        <RatingStars
          initialRating={userRating}
          onRate={(rating) => setSelectedRating(rating)}
        />

        {ratingSubmitted && (
          <p className="text-xs font-semibold text-emerald-700 animate-in fade-in">
            Avaliação gravada no banco de dados com sucesso!
          </p>
        )}

        <div>
          <button
            onClick={handleSendRating}
            disabled={loadingRating || selectedRating === 0}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-colors shadow-xs"
          >
            {loadingRating ? 'Gravando...' : 'Enviar avaliação'}
          </button>
        </div>
      </div>

      {/* Section: Deixe seu comentário */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-gray-900">Deixe seu comentário</h3>

        <form onSubmit={handleSendComment} className="space-y-3">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value.slice(0, 300))}
            placeholder="Conte o que achou das refeições desta semana..."
            rows={4}
            className="w-full p-4 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-400"
          ></textarea>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400">
              {commentText.length}/300 caracteres
            </span>

            <button
              type="submit"
              disabled={!commentText.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-colors shadow-xs"
            >
              Enviar comentário
            </button>
          </div>

          {commentSubmitted && (
            <p className="text-xs font-semibold text-emerald-700 animate-in fade-in">
              Comentário publicado com sucesso!
            </p>
          )}
        </form>
      </div>

      {/* Section: COMENTÁRIOS DO CARDÁPIO */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold tracking-wider text-gray-400 uppercase">
          COMENTÁRIOS DO CARDÁPIO
        </h3>

        <div className="space-y-3">
          {activeComments.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-gray-900">{item.studentName}</span>
                <span className="text-gray-400 text-[11px]">{item.date}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{item.comment}</p>
            </div>
          ))}

          {activeComments.length === 0 && (
            <div className="bg-white p-6 rounded-2xl text-center text-xs text-gray-400">
              Nenhum comentário publicado ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
