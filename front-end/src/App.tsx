import React, { useState, useEffect } from 'react';
import type { User, CommentItem, DailyMealPlan } from './types';
import { api } from './services/api';
import { Loader2 } from 'lucide-react';

// Components
import { Header } from './components/common/Header';
import { LoginView } from './components/auth/LoginView';
import { ProfileModal } from './components/profile/ProfileModal';

// Direção views
import { DashboardView } from './components/direccion/DashboardView';
import { StudentRegisterView } from './components/direccion/StudentRegisterView';
import { NutritionistRegisterView } from './components/direccion/NutritionistRegisterView';
import { UserManagementView } from './components/direccion/UserManagementView';
import { CommentModerationView } from './components/direccion/CommentModerationView';

// Nutricionista views
import { MenuManagementView } from './components/nutritionist/MenuManagementView';

// Aluno views
import { StudentMenuView } from './components/student/StudentMenuView';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  const [users, setUsers] = useState<User[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [mealPlans, setMealPlans] = useState<Record<string, DailyMealPlan>>({});

  const [activeTab, setActiveTab] = useState<string>('painel');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [selectedUserForModal, setSelectedUserForModal] = useState<User | null>(null);

  // Helper to load fresh data from API
  const loadBackendData = async () => {
    try {
      const [fetchedUsers, fetchedComments, fetchedCardapio] = await Promise.all([
        api.getUsers().catch(() => []),
        api.getComments().catch(() => []),
        api.getCardapioSemanal().catch(() => ({ cardapio: null, mealPlans: {} })),
      ]);

      setUsers(fetchedUsers || []);
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
          if (role === 'direcao') setActiveTab('painel');
          else if (role === 'nutricionista') setActiveTab('gerenciar-cardapio');
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
    if (role === 'direcao') setActiveTab('painel');
    else if (role === 'nutricionista') setActiveTab('gerenciar-cardapio');
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

  // Add new student
  const handleAddStudent = async (studentData: Omit<User, 'id' | 'createdAt'> & { password: string }) => {
  try {
    const res = await api.createStudent({
      name: studentData.name,
      cpf: studentData.cpf,
      email: studentData.email,
      password: studentData.password,
      schoolYear: studentData.schoolYear,
      dietaryRestriction: studentData.dietaryRestriction,
    });

    setUsers((prev) => [res.user, ...prev.filter((u) => u.id !== res.user.id)]);
  } catch (err: any) {
    alert(err.message || 'Erro ao cadastrar aluno');
  }
};

  // Add new nutritionist
  const handleAddNutritionist = async (
  nutriData: Omit<User, 'id' | 'createdAt'> & { password: string }
) => {
  try {
    const res = await api.createNutritionist({
      name: nutriData.name,
      cpf: nutriData.cpf,
      email: nutriData.email,
      password: nutriData.password,
    });

    setUsers((prev) => [res.user, ...prev.filter((u) => u.id !== res.user.id)]);
  } catch (err: any) {
    alert(err.message || 'Erro ao cadastrar nutricionista');
  }
};

  // Toggle user status (Ativo / Inativo)
  const handleToggleUserStatus = async (userId: string) => {
    try {
      await api.toggleUserStatus(userId);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: u.status === 'Ativo' ? 'Inativo' : 'Ativo' } : u
        )
      );
    } catch (err: any) {
      alert(err.message || 'Erro ao alterar status do usuário');
    }
  };

  // Remove comment (Direção)
  const handleRemoveComment = async (commentId: string, reason: string) => {
    try {
      await api.removeComment(commentId, reason);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                status: 'Removido',
                comment: 'Comentário inadequado removido pela direção.',
                removalReason: reason,
              }
            : c
        )
      );
    } catch (err: any) {
      alert(err.message || 'Erro ao remover comentário');
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

  // Calculate statistics for Direção dashboard
  const studentCount = users.filter((u) => u.role === 'aluno').length;
  const nutriCount = users.filter((u) => u.role === 'nutricionista').length;
  const activeCommentsCount = comments.filter((c) => c.status === 'Ativo').length;
  const removedCommentsCount = comments.filter((c) => c.status === 'Removido').length;

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
        {/* Direção Views */}
        {currentUser.role === 'direcao' && (
          <>
            {activeTab === 'painel' && (
              <DashboardView
                studentCount={studentCount}
                nutriCount={nutriCount}
                activeCommentsCount={activeCommentsCount}
                removedCommentsCount={removedCommentsCount}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'cadastrar-aluno' && (
              <StudentRegisterView onAddStudent={handleAddStudent} />
            )}

            {activeTab === 'cadastrar-nutricionista' && (
              <NutritionistRegisterView onAddNutritionist={handleAddNutritionist} />
            )}

            {activeTab === 'gerenciar-usuarios' && (
              <UserManagementView
                users={users}
                onToggleUserStatus={handleToggleUserStatus}
                onViewUser={(user) => {
                  setSelectedUserForModal(user);
                  setIsProfileOpen(true);
                }}
              />
            )}

            {activeTab === 'fiscalizar-comentarios' && (
              <CommentModerationView
                comments={comments}
                onRemoveComment={handleRemoveComment}
              />
            )}
          </>
        )}

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
