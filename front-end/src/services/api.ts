import type { User, CommentItem, DailyMealPlan } from '../types';

const API_BASE_URL = 'http://localhost:3000';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
const config: RequestInit = {
...options,
credentials: 'include',
headers: {
'Content-Type': 'application/json',
...options.headers,
},
};

const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

if (!response.ok) {
const errorData = await response.json().catch(() => ({}));
throw new Error(errorData.erro || errorData.mensagem || 'Erro na requisição');
}

return response.json();
}

export interface AlimentoItem {
id: string;
nome: string;
descricao?: string;
calorias?: number;
}

export interface AvaliacaoData {
cardapioId?: number;
userRating: number;
averageRating: number;
totalRatings: number;
}

export const api = {
// Autenticação
login: async (
email: string,
password: string
): Promise<{ usuario: User; mensagem: string }> => {
return request<{ usuario: User; mensagem: string }>('/auth/login', {
method: 'POST',
body: JSON.stringify({ email, password }),
});
},

logout: async (): Promise<{ mensagem: string }> => {
return request<{ mensagem: string }>('/auth/logout', {
method: 'POST',
});
},

getMe: async (): Promise<{ usuario: User }> => {
return request<{ usuario: User }>('/auth/me', {
method: 'GET',
});
},

// Comentários
getComments: async (): Promise<CommentItem[]> => {
return request<CommentItem[]>('/comentarios', {
method: 'GET',
});
},

createComment: async (comment: string): Promise<CommentItem> => {
return request<CommentItem>('/comentarios', {
method: 'POST',
body: JSON.stringify({ comment }),
});
},

// Alimentos CRUD
getAlimentos: async (): Promise<AlimentoItem[]> => {
return request<AlimentoItem[]>('/alimentos', {
method: 'GET',
});
},

createAlimento: async (
alimentoData: {
nome: string;
descricao?: string;
calorias?: number;
}
): Promise<{ alimento: AlimentoItem; mensagem: string }> => {
return request<{ alimento: AlimentoItem; mensagem: string }>('/alimentos', {
method: 'POST',
body: JSON.stringify(alimentoData),
});
},

deleteAlimento: async (
id: string
): Promise<{ mensagem: string }> => {
return request<{ mensagem: string }>(`/alimentos/${id}`, {
method: 'DELETE',
});
},

// Cardápio e refeições
getCardapioSemanal: async (): Promise<{
cardapio: any;
mealPlans: Record<string, DailyMealPlan>;
}> => {
return request<{
cardapio: any;
mealPlans: Record<string, DailyMealPlan>;
}>('/cardapios', {
method: 'GET',
});
},

updateMealFoods: async (
day: string,
mealType: 'breakfast' | 'lunch' | 'snack',
items: string[]
): Promise<{ mensagem: string }> => {
return request<{ mensagem: string }>('/cardapios/refeicoes/alimentos', {
method: 'POST',
body: JSON.stringify({ day, mealType, items }),
});
},

// Avaliações
getAvaliacoes: async (): Promise<AvaliacaoData> => {
return request<AvaliacaoData>('/avaliacoes', {
method: 'GET',
});
},

submitAvaliacao: async (
nota: number,
cardapioId?: number
): Promise<{ mensagem: string; nota: number }> => {
return request<{ mensagem: string; nota: number }>('/avaliacoes', {
method: 'POST',
body: JSON.stringify({ nota, cardapioId }),
});
},
};
