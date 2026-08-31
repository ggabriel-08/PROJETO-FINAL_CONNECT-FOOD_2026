import React from 'react';
import { X } from 'lucide-react';
import type { User } from '../../types';
import { Badge } from '../common/Badge';

interface ProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#f8faf7] w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-emerald-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <h2 className="text-lg font-bold text-gray-900">Meu Perfil</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Nome</span>
            <span className="font-semibold text-gray-800">{user.name}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">E-mail</span>
            <span className="font-semibold text-gray-800">{user.email}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">CPF</span>
            <span className="font-semibold text-gray-800">{user.cpf}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Cargo</span>
            <span className="font-semibold text-gray-800">{user.roleLabel}</span>
          </div>

          {user.schoolYear && (
            <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
              <span className="text-gray-500 font-medium">Ano escolar</span>
              <span className="font-semibold text-gray-800">{user.schoolYear}</span>
            </div>
          )}

          {user.dietaryRestriction && (
            <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
              <span className="text-gray-500 font-medium">Restrição alimentar</span>
              <Badge variant="active">
                {user.dietaryRestriction}
              </Badge>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-gray-200 text-gray-700 font-medium text-xs hover:bg-gray-50 transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={onLogout}
            className="px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};
