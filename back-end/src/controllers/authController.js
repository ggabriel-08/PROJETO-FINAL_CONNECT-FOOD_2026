import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_connect_food_jwt_key_2026';

class AuthController {
    async login(req, res) {
        try {
            const { email, password, senha } = req.body;
            const inputPassword = password || senha;

            if (!email || !inputPassword) {
                return res.status(400).json({ erro: 'Por favor, informe e-mail e senha.' });
            }

            const emailNormalizado = email.toLowerCase().trim();
            const [users] = await pool.query(
                `SELECT u.*, GROUP_CONCAT(r.nome_restricao SEPARATOR ', ') as restricoes
                 FROM usuarios u
                 LEFT JOIN usuario_restricao ur ON u.id_usuario = ur.id_usuario
                 LEFT JOIN restricoes_alimentares r ON ur.id_restricao = r.id_restricao
                 WHERE LOWER(u.email) = ?
                 GROUP BY u.id_usuario`,
                [emailNormalizado]
            );

            if (users.length === 0) {
                return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
            }

            const user = users[0];

            if (!user.status) {
                return res.status(403).json({ erro: 'Usuário inativo. Entre em contato com a direção.' });
            }

            const isMatch = await bcrypt.compare(inputPassword, user.senha);
            if (!isMatch) {
                return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
            }

            const token = jwt.sign(
                {
                    id_usuario: user.id_usuario,
                    email: user.email,
                    perfil: user.perfil,
                    nome: user.nome
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Set HTTP-Only Cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: false, // Local HTTP
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });

            const roleFormatted = user.perfil.toLowerCase();
            const roleLabel = user.perfil === 'DIRECAO' ? 'Direção' : user.perfil === 'NUTRICIONISTA' ? 'Nutricionista' : 'Aluno';

            return res.json({
                mensagem: 'Login realizado com sucesso',
                usuario: {
                    id: String(user.id_usuario),
                    name: user.nome,
                    cpf: user.cpf,
                    email: user.email,
                    role: roleFormatted,
                    roleLabel: roleLabel,
                    status: user.status ? 'Ativo' : 'Inativo',
                    createdAt: new Date(user.data_cadastro).toLocaleDateString('pt-BR'),
                    schoolYear: user.ano_escolar || undefined,
                    dietaryRestriction: user.restricoes || (roleFormatted === 'aluno' ? 'Sem restrição' : undefined)
                }
            });

        } catch (error) {
            console.error('Erro no login:', error);
            return res.status(500).json({ erro: 'Erro interno ao realizar login' });
        }
    }

    async logout(req, res) {
        res.clearCookie('token');
        return res.json({ mensagem: 'Logout realizado com sucesso' });
    }

    async me(req, res) {
        try {
            const token = req.cookies?.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null);

            if (!token) {
                return res.status(401).json({ erro: 'Não autenticado' });
            }

            const decoded = jwt.verify(token, JWT_SECRET);

            const [users] = await pool.query(
                `SELECT u.*, GROUP_CONCAT(r.nome_restricao SEPARATOR ', ') as restricoes
                 FROM usuarios u
                 LEFT JOIN usuario_restricao ur ON u.id_usuario = ur.id_usuario
                 LEFT JOIN restricoes_alimentares r ON ur.id_restricao = r.id_restricao
                 WHERE u.id_usuario = ?
                 GROUP BY u.id_usuario`,
                [decoded.id_usuario]
            );

            if (users.length === 0 || !users[0].status) {
                res.clearCookie('token');
                return res.status(401).json({ erro: 'Sessão inválida ou usuário inativo' });
            }

            const user = users[0];
            const roleFormatted = user.perfil.toLowerCase();
            const roleLabel = user.perfil === 'DIRECAO' ? 'Direção' : user.perfil === 'NUTRICIONISTA' ? 'Nutricionista' : 'Aluno';

            return res.json({
                usuario: {
                    id: String(user.id_usuario),
                    name: user.nome,
                    cpf: user.cpf,
                    email: user.email,
                    role: roleFormatted,
                    roleLabel: roleLabel,
                    status: user.status ? 'Ativo' : 'Inativo',
                    createdAt: new Date(user.data_cadastro).toLocaleDateString('pt-BR'),
                    schoolYear: user.ano_escolar || undefined,
                    dietaryRestriction: user.restricoes || (roleFormatted === 'aluno' ? 'Sem restrição' : undefined)
                }
            });
        } catch (error) {
            res.clearCookie('token');
            return res.status(401).json({ erro: 'Sessão expirada' });
        }
    }
}

export default new AuthController();
