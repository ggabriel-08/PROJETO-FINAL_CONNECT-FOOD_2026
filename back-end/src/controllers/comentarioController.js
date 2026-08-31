import pool from '../config/db.js';

class ComentarioController {
    // GET /comentarios
    async index(req, res) {
        try {
            const [rows] = await pool.query(
                `SELECT c.id_comentario, c.comentario, c.data_comentario, c.status, c.motivo_remocao,
                        u.nome as studentName, u.email
                 FROM comentarios c
                 JOIN usuarios u ON c.id_usuario = u.id_usuario
                 ORDER BY c.id_comentario DESC`
            );

            const comments = rows.map(item => ({
                id: String(item.id_comentario),
                studentName: item.studentName,
                comment: item.status === 'REMOVIDO' ? 'Comentário inadequado removido pela direção.' : item.comentario,
                date: new Date(item.data_comentario).toLocaleDateString('pt-BR'),
                menuInfo: 'Semana 18/08 a 22/08',
                status: item.status === 'REMOVIDO' ? 'Removido' : 'Ativo',
                removalReason: item.motivo_remocao || undefined
            }));

            return res.json(comments);
        } catch (error) {
            console.error('Erro ao buscar comentários:', error);
            return res.status(500).json({ erro: 'Erro ao buscar comentários' });
        }
    }

    // POST /comentarios
    async store(req, res) {
        try {
            const { comment } = req.body;
            const id_usuario = req.user.id_usuario;

            if (!comment) {
                return res.status(400).json({ erro: 'O comentário não pode ser vazio.' });
            }

            // Find latest active menu
            const [menus] = await pool.query('SELECT id_cardapio FROM cardapios WHERE status = TRUE ORDER BY id_cardapio DESC LIMIT 1');
            const cardapioId = menus.length > 0 ? menus[0].id_cardapio : 1;

            const [result] = await pool.query(
                `INSERT INTO comentarios (id_usuario, id_cardapio, comentario, status)
                 VALUES (?, ?, ?, 'ATIVO')`,
                [id_usuario, cardapioId, comment]
            );

            // Fetch user name
            const [users] = await pool.query('SELECT nome FROM usuarios WHERE id_usuario = ?', [id_usuario]);
            const studentName = users.length > 0 ? users[0].nome : 'Aluno';

            return res.status(201).json({
                id: String(result.insertId),
                studentName,
                comment,
                date: new Date().toLocaleDateString('pt-BR'),
                menuInfo: 'Semana 18/08 a 22/08',
                status: 'Ativo'
            });
        } catch (error) {
            console.error('Erro ao adicionar comentário:', error);
            return res.status(500).json({ erro: 'Erro ao adicionar comentário' });
        }
    }

    // PATCH /comentarios/:id/remover
    async remove(req, res) {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            const id_moderador = req.user.id_usuario;

            await pool.query(
                `UPDATE comentarios
                 SET status = 'REMOVIDO', id_moderador = ?, data_moderacao = NOW(), motivo_remocao = ?
                 WHERE id_comentario = ?`,
                [id_moderador, reason || 'Comentário inadequado removido pela direção', id]
            );

            return res.json({ mensagem: 'Comentário removido com sucesso' });
        } catch (error) {
            console.error('Erro ao remover comentário:', error);
            return res.status(500).json({ erro: 'Erro ao remover comentário' });
        }
    }
}

export default new ComentarioController();
