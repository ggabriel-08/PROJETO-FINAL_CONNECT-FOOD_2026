import app from './app.js';
import pool from './src/config/db.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexão com o banco de dados MySQL realizada com sucesso!');
        connection.release();

        app.listen(PORT, () => {
            console.log(`🚀 Servidor Connect Food rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Erro ao iniciar o servidor ou conectar ao banco:', error);
        process.exit(1);
    }
}

startServer();
