import database from "../database/connection.js"

class UserRepository{
    async getByEmail(email){
        const [rows] = await database.query("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (!rows[0]) return null;

        return rows[0];
    }

    async create(data) {
        const { nome, email, senha, role, token_verificacao, token_expiracao } = data;

        const [result] = await database.query(`
            INSERT INTO usuarios
            (nome, email, senha, role, status, token_verificacao, token_verificacao_expira)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nome, email, senha, role, 1, token_verificacao, token_expiracao]
    )
    }
}

export default new UserRepository();
