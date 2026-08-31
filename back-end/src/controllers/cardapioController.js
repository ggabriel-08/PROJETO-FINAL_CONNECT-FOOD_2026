import pool from '../config/db.js';

function getMondayOfCurrentWeek() {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diff);
    return monday;
}

function getDateStringForDay(dayName) {
    const dayOffsetMap = {
        'Segunda-feira': 0,
        'Terça-feira': 1,
        'Quarta-feira': 2,
        'Quinta-feira': 3,
        'Sexta-feira': 4,
        'Sábado': 5,
        'Domingo': 6
    };
    const offset = dayOffsetMap[dayName] !== undefined ? dayOffsetMap[dayName] : 0;
    const monday = getMondayOfCurrentWeek();
    monday.setDate(monday.getDate() + offset);

    const year = monday.getFullYear();
    const month = String(monday.getMonth() + 1).padStart(2, '0');
    const day = String(monday.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

class CardapioController {
    // GET /cardapios
    async index(req, res) {
        try {
            // Fetch active cardapio
            const [cardapios] = await pool.query('SELECT * FROM cardapios WHERE status = TRUE ORDER BY id_cardapio DESC LIMIT 1');
            if (cardapios.length === 0) {
                return res.json({ cardapio: null, mealPlans: {} });
            }

            const cardapio = cardapios[0];

            // Fetch meals with foods for this cardapio
            const [mealsWithFoods] = await pool.query(
                `SELECT r.id_refeicao, r.tipo_refeicao, DATE_FORMAT(r.data_refeicao, '%Y-%m-%d') as data_refeicao,
                        a.id_alimento, a.nome_alimento, a.descricao, a.calorias, ra.quantidade
                 FROM refeicoes r
                 LEFT JOIN refeicao_alimento ra ON r.id_refeicao = ra.id_refeicao
                 LEFT JOIN alimentos a ON ra.id_alimento = a.id_alimento
                 WHERE r.id_cardapio = ?
                 ORDER BY r.data_refeicao ASC, r.id_refeicao ASC`,
                [cardapio.id_cardapio]
            );

            const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
            const mealPlans = {};

            // Initialize all 5 weekdays
            const defaultWeekdays = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];
            defaultWeekdays.forEach(d => {
                mealPlans[d] = {
                    dayOfWeek: d,
                    breakfast: [],
                    lunch: [],
                    snack: []
                };
            });

            mealsWithFoods.forEach(row => {
                if (!row.data_refeicao) return;
                
                const parts = row.data_refeicao.split('-').map(Number);
                const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
                const dayName = dayNames[dateObj.getDay()] || 'Segunda-feira';

                if (!mealPlans[dayName]) {
                    mealPlans[dayName] = {
                        dayOfWeek: dayName,
                        date: row.data_refeicao,
                        breakfast: [],
                        lunch: [],
                        snack: []
                    };
                }

                if (row.nome_alimento) {
                    if (row.tipo_refeicao === 'CAFE_DA_MANHA') {
                        if (!mealPlans[dayName].breakfast.includes(row.nome_alimento)) mealPlans[dayName].breakfast.push(row.nome_alimento);
                    } else if (row.tipo_refeicao === 'ALMOCO') {
                        if (!mealPlans[dayName].lunch.includes(row.nome_alimento)) mealPlans[dayName].lunch.push(row.nome_alimento);
                    } else if (row.tipo_refeicao === 'CAFE_DA_TARDE') {
                        if (!mealPlans[dayName].snack.includes(row.nome_alimento)) mealPlans[dayName].snack.push(row.nome_alimento);
                    }
                }
            });

            return res.json({
                cardapio: {
                    id: cardapio.id_cardapio,
                    data_inicio: cardapio.data_inicio,
                    data_fim: cardapio.data_fim,
                    tipo: cardapio.tipo,
                    observacoes: cardapio.observacoes
                },
                mealPlans
            });
        } catch (error) {
            console.error('Erro ao buscar cardápio:', error);
            return res.status(500).json({ erro: 'Erro ao buscar cardápio do banco de dados' });
        }
    }

    // POST /cardapios/refeicoes/alimentos
    async updateMealFoods(req, res) {
        try {
            const { day, mealType, items } = req.body;
            // mealType: 'breakfast' | 'lunch' | 'snack'

            if (!day || !mealType || !Array.isArray(items)) {
                return res.status(400).json({ erro: 'Parâmetros inválidos para atualização do cardápio.' });
            }

            const dbMealType = mealType === 'breakfast' ? 'CAFE_DA_MANHA' : mealType === 'snack' ? 'CAFE_DA_TARDE' : 'ALMOCO';
            const targetDateStr = getDateStringForDay(day);

            // Get active cardapio
            const [cardapios] = await pool.query('SELECT id_cardapio FROM cardapios WHERE status = TRUE ORDER BY id_cardapio DESC LIMIT 1');
            let cardapioId;

            if (cardapios.length === 0) {
                const mondayStr = getDateStringForDay('Segunda-feira');
                const fridayStr = getDateStringForDay('Sexta-feira');
                const [cRes] = await pool.query(
                    `INSERT INTO cardapios (data_inicio, data_fim, tipo, observacoes, status)
                     VALUES (?, ?, 'PADRAO', 'Cardápio Semanal SESI', TRUE)`,
                    [mondayStr, fridayStr]
                );
                cardapioId = cRes.insertId;
            } else {
                cardapioId = cardapios[0].id_cardapio;
            }

            // Find or create meal for this cardapio, dbMealType AND targetDateStr
            let [meals] = await pool.query(
                'SELECT id_refeicao FROM refeicoes WHERE id_cardapio = ? AND tipo_refeicao = ? AND data_refeicao = ?',
                [cardapioId, dbMealType, targetDateStr]
            );

            let mealId;
            if (meals.length === 0) {
                const [mRes] = await pool.query(
                    `INSERT INTO refeicoes (id_cardapio, tipo_refeicao, data_refeicao)
                     VALUES (?, ?, ?)`,
                    [cardapioId, dbMealType, targetDateStr]
                );
                mealId = mRes.insertId;
            } else {
                mealId = meals[0].id_refeicao;
            }

            // Clear previous food links for this meal
            await pool.query('DELETE FROM refeicao_alimento WHERE id_refeicao = ?', [mealId]);

            // Insert each food item
            for (const itemName of items) {
                const cleanName = itemName.trim();
                if (!cleanName) continue;

                let [foodRows] = await pool.query('SELECT id_alimento FROM alimentos WHERE LOWER(nome_alimento) = ?', [cleanName.toLowerCase()]);
                let foodId;

                if (foodRows.length === 0) {
                    const [fRes] = await pool.query('INSERT INTO alimentos (nome_alimento) VALUES (?)', [cleanName]);
                    foodId = fRes.insertId;
                } else {
                    foodId = foodRows[0].id_alimento;
                }

                await pool.query('INSERT IGNORE INTO refeicao_alimento (id_refeicao, id_alimento) VALUES (?, ?)', [mealId, foodId]);
            }

            return res.json({
                mensagem: `Refeição de ${day} atualizada com sucesso no banco de dados!`,
                data_refeicao: targetDateStr
            });

        } catch (error) {
            console.error('Erro ao atualizar alimentos da refeição:', error);
            return res.status(500).json({ erro: 'Erro ao atualizar cardápio no banco de dados' });
        }
    }
}

export default new CardapioController();
