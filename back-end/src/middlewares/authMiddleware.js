import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_connect_food_jwt_key_2026';

export function authMiddleware(req, res, next) {
    // Check token from HTTP-Only cookie first, then fallback to Authorization header
    const token = req.cookies?.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null);

    if (!token) {
        return res.status(401).json({ erro: 'Token não fornecido ou não autenticado' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ erro: 'Token inválido ou expirado' });
    }
}