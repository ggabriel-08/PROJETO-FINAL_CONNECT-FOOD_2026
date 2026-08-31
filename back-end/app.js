import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './src/routes/authRoutes.js';
import usuarioRoutes from './src/routes/usuarioRoutes.js';
import comentarioRoutes from './src/routes/comentarioRoutes.js';
import alimentoRoutes from './src/routes/alimentoRoutes.js';
import cardapioRoutes from './src/routes/cardapioRoutes.js';
import avaliacaoRoutes from './src/routes/avaliacaoRoutes.js';

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/comentarios', comentarioRoutes);
app.use('/alimentos', alimentoRoutes);
app.use('/cardapios', cardapioRoutes);
app.use('/avaliacoes', avaliacaoRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
});

export default app;