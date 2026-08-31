import React from 'react';
import { Trash2 } from 'lucide-react';
import type { CommentItem } from '../../types';
import { Badge } from '../common/Badge';

interface CommentModerationViewProps {
  comments: CommentItem[];
  onRemoveComment: (commentId: string, reason: string) => void;
}

export const CommentModerationView: React.FC<CommentModerationViewProps> = ({
  comments,
  onRemoveComment,
}) => {
  const handleRemove = (comment: CommentItem) => {
    const reason = prompt(
      `Motivo da remoção do comentário de ${comment.studentName}:`,
      'Linguagem inadequada'
    );
    if (reason !== null) {
      onRemoveComment(comment.id, reason || 'Linguagem inadequada');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Fiscalização de Comentários</h2>
        <p className="text-xs text-gray-500 mt-1">
          Comentários removidos deixam de aparecer para alunos e nutricionistas.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                <th className="py-4 px-6">Aluno</th>
                <th className="py-4 px-6 max-w-xs">Comentário</th>
                <th className="py-4 px-6">Data</th>
                <th className="py-4 px-6">Cardápio</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {comments.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-900">{item.studentName}</td>
                  <td className="py-4 px-6 max-w-xs text-gray-600 leading-relaxed">
                    {item.comment}
                  </td>
                  <td className="py-4 px-6 text-gray-500 whitespace-nowrap">{item.date}</td>
                  <td className="py-4 px-6 text-gray-600 whitespace-nowrap">{item.menuInfo}</td>
                  <td className="py-4 px-6">
                    <Badge variant={item.status === 'Ativo' ? 'active' : 'removed'}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    {item.status === 'Ativo' ? (
                      <button
                        onClick={() => handleRemove(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remover comentário</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-gray-400 italic">
                        Motivo: {item.removalReason || 'Linguagem inadequada'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
