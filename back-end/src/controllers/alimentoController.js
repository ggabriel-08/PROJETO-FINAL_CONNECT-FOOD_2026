import pool from '../config/db.js';

class AlimentoController {
    // GET /alimentos
    async index(req, res) {
        try {
            const [rows] = await pool.query('SELECT * FROM alimentos ORDER BY nome_alimento ASC');
            const alimentos = rows.map(a => ({
                id: String(a.id_alimento),
                nome: a.nome_alimento,
                descricao: a.descricao || '',
                calorias: a.calorias ? Number(a.calorias) : 0
            }));
            return res.json(alimentos);
        } catch (error) {
            console.error('Erro ao buscar alimentos:', error);
            return res.status(500).json({ erro: 'Erro ao buscar alimentos' });
        }
    }

    // POST /alimentos
    async store(req, res) {
        try {
            const { nome, nome_alimento, descricao, calorias } = req.body;
            const targetName = (nome || nome_alimento || '').trim();

            if (!targetName) {
                return res.status(400).json({ erro: 'O nome do alimento é obrigatório.' });
            }

            const [result] = await pool.query(
                'INSERT INTO alimentos (nome_alimento, descricao, calorias) VALUES (?, ?, ?)',
                [targetName, descricao || null, calorias ? Number(calorias) : null]
            );

            const insertedId = result.insertId;

            return res.status(201).json({
                mensagem: 'Alimento cadastrado com sucesso!',
                alimento: {
                    id: String(insertedId),
                    nome: targetName,
                    descricao: descricao || '',
                    calorias: calorias ? Number(calorias) : 0
                }
            });
        } catch (error) {
            console.error('Erro ao cadastrar alimento:', error);
            return res.status(500).json({ erro: 'Erro ao cadastrar alimento no banco de dados' });
        }
    }

    // DELETE /alimentos/:id
    async destroy(req, res) {
        try {
            const { id } = req.params;

            const [existing] = await pool.query('SELECT id_alimento FROM alimentos WHERE id_alimento = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({ erro: 'Alimento não encontrado.' });
            }

            // ON DELETE CASCADE in refeicao_alimento table handles references automatically
            await pool.query('DELETE FROM alimentos WHERE id_alimento = ?', [id]);

            return res.json({ mensagem: 'Alimento excluído com sucesso!' });
        } catch (error) {
            console.error('Erro ao excluir alimento:', error);
            return res.status(500).json({ erro: 'Erro ao excluir alimento do banco de dados' });
        }
    }
}

export default new AlimentoController();
