import pool from '../config/db.js';

class AvaliacaoController {
    // GET /avaliacoes
    async index(req, res) {
        try {
            const userId = req.user.id_usuario;

            // Get active cardapio
            const [cardapios] = await pool.query('SELECT id_cardapio FROM cardapios WHERE status = TRUE ORDER BY id_cardapio DESC LIMIT 1');
            if (cardapios.length === 0) {
                return res.json({ userRating: 0, averageRating: 0, totalRatings: 0 });
            }

            const cardapioId = cardapios[0].id_cardapio;

            // Get user's rating
            const [userRatingRows] = await pool.query(
                'SELECT nota FROM avaliacoes WHERE id_usuario = ? AND id_cardapio = ?',
                [userId, cardapioId]
            );

            const userRating = userRatingRows.length > 0 ? userRatingRows[0].nota : 0;

            // Get average rating
            const [statsRows] = await pool.query(
                'SELECT AVG(nota) as avgRating, COUNT(id_avaliacao) as total FROM avaliacoes WHERE id_cardapio = ?',
                [cardapioId]
            );

            const avgRating = statsRows.length > 0 && statsRows[0].avgRating ? Number(statsRows[0].avgRating).toFixed(1) : 0;
            const totalRatings = statsRows.length > 0 ? statsRows[0].total : 0;

            return res.json({
                cardapioId,
                userRating,
                averageRating: Number(avgRating),
                totalRatings
            });
        } catch (error) {
            console.error('Erro ao buscar avaliações:', error);
            return res.status(500).json({ erro: 'Erro ao buscar avaliações' });
        }
    }

    // POST /avaliacoes
    async store(req, res) {
        try {
            const { nota, cardapioId } = req.body;
            const userId = req.user.id_usuario;

            const ratingValue = Number(nota);
            if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
                return res.status(400).json({ erro: 'A nota deve ser um valor inteiro entre 1 e 5.' });
            }

            let targetCardapioId = cardapioId;
            if (!targetCardapioId) {
                const [cardapios] = await pool.query('SELECT id_cardapio FROM cardapios WHERE status = TRUE ORDER BY id_cardapio DESC LIMIT 1');
                if (cardapios.length === 0) {
                    return res.status(400).json({ erro: 'Nenhum cardápio ativo para avaliar.' });
                }
                targetCardapioId = cardapios[0].id_cardapio;
            }

            await pool.query(
                `INSERT INTO avaliacoes (id_usuario, id_cardapio, nota)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE nota = VALUES(nota), data_avaliacao = NOW()`,
                [userId, targetCardapioId, ratingValue]
            );

            return res.json({
                mensagem: 'Avaliação registrada com sucesso no banco de dados!',
                nota: ratingValue
            });
        } catch (error) {
            console.error('Erro ao registrar avaliação:', error);
            return res.status(500).json({ erro: 'Erro ao salvar avaliação no banco de dados' });
        }
    }
}

export default new AvaliacaoController();
