import React, { useState, useEffect } from 'react';
import type { User, CommentItem, DailyMealPlan } from './types';
import { api } from './services/api';
import { Loader2 } from 'lucide-react';

// Components
import { Header } from './components/common/Header';
import { LoginView } from './components/auth/LoginView';
import { ProfileModal } from './components/profile/ProfileModal';

// Nutricionista views
import { MenuManagementView } from './components/nutritionist/MenuManagementView';

// Aluno views
import { StudentMenuView } from './components/student/StudentMenuView';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [mealPlans, setMealPlans] = useState<Record<string, DailyMealPlan>>({});

  const [activeTab, setActiveTab] = useState<string>('painel');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [selectedUserForModal, setSelectedUserForModal] = useState<User | null>(null);

  // Helper to load fresh data from API
  const loadBackendData = async () => {
    try {
      const [fetchedComments, fetchedCardapio] = await Promise.all([
      api.getComments().catch(() => []),
      api.getCardapioSemanal().catch(() => ({ cardapio: null, mealPlans: {} })),
    ]);

    setComments(fetchedComments || []);
      if (fetchedCardapio && fetchedCardapio.mealPlans) {
        setMealPlans(fetchedCardapio.mealPlans);
      }
    } catch (err) {
      console.error('Erro ao carregar dados do servidor:', err);
    }
  };

  // Check active HTTP-Only cookie session on initial mount ("Manter Login")
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.getMe();
        if (response.usuario) {
          setCurrentUser(response.usuario);
          const role = response.usuario.role;
          if (role === 'nutricionista') setActiveTab('gerenciar-cardapio');
          else if (role === 'aluno') setActiveTab('cardapio');

          await loadBackendData();
        }
      } catch (err) {
        // No active session found
        setCurrentUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkSession();
  }, []);

  // Handle login success from LoginView
 const handleLoginSuccess = async (user: User) => {
  setCurrentUser(user);
  const role = user.role;

  if (role === 'nutricionista') setActiveTab('gerenciar-cardapio');
  else if (role === 'aluno') setActiveTab('cardapio');

  await loadBackendData();
};

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Erro no logout:', err);
    } finally {
      setCurrentUser(null);
      setIsProfileOpen(false);
      setSelectedUserForModal(null);
    }
  };


  // Add student comment
  const handleAddComment = async (commentText: string) => {
    if (!currentUser) return;
    try {
      const newComment = await api.createComment(commentText);
      setComments((prev) => [newComment, ...prev]);
    } catch (err: any) {
      alert(err.message || 'Erro ao adicionar comentário');
    }
  };

  // Update meal plan (Nutricionista)
  const handleUpdateMealPlan = (
    day: string,
    mealType: 'breakfast' | 'lunch' | 'snack',
    items: string[]
  ) => {
    setMealPlans((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: items,
      },
    }));
  };

  // Show loading spinner while verifying HTTP-Only cookie session
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-emerald-50/50">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
        <p className="text-xs font-semibold text-emerald-800">Verificando sessão segura...</p>
      </div>
    );
  }

  // If not logged in, render Login screen
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#f4f9f5] flex flex-col font-sans antialiased text-gray-800">
      {/* Header Bar */}
      <Header
        user={currentUser}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenProfile={() => {
          setSelectedUserForModal(currentUser);
          setIsProfileOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Nutricionista Views */}
        {currentUser.role === 'nutricionista' && (
          <>
            {activeTab === 'gerenciar-cardapio' && (
              <MenuManagementView
                mealPlans={mealPlans}
                onUpdateMealPlan={handleUpdateMealPlan}
              />
            )}

            {activeTab === 'comentarios' && (
              <div className="space-y-6 max-w-5xl mx-auto">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">
                    Comentários dos Alunos
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Feedback dos alunos sobre os cardápios servidos.
                  </p>
                </div>

                <div className="space-y-3">
                  {comments
                    .filter((c) => c.status === 'Ativo')
                    .map((item) => (
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
                  {comments.filter((c) => c.status === 'Ativo').length === 0 && (
                    <div className="bg-white p-6 rounded-2xl text-center text-xs text-gray-400">
                      Nenhum comentário publicado pelos alunos ainda.
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Aluno Views */}
        {currentUser.role === 'aluno' && (
          <StudentMenuView
            studentName={currentUser.name}
            dietaryRestriction={currentUser.dietaryRestriction}
            mealPlans={mealPlans}
            comments={comments}
            onAddComment={handleAddComment}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white py-4 text-center text-xs text-gray-400">
        <p>Connect Food © 2026 — Gestão Nutricional Escolar SESI</p>
      </footer>

      {/* User Profile Modal */}
      {selectedUserForModal && (
        <ProfileModal
          user={selectedUserForModal}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
