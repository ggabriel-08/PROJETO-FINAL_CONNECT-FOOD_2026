export function authorizeRole(allowedRoles = []) {
    return (req, res, next) => {
        if (!req.user || !req.user.perfil) {
            return res.status(401).json({ erro: 'Usuário não autenticado ou perfil não informado.' });
        }

        const userPerfil = req.user.perfil.toUpperCase();
        const uppercaseAllowed = allowedRoles.map(r => r.toUpperCase());

        if (!uppercaseAllowed.includes(userPerfil)) {
            return res.status(403).json({ erro: 'Acesso negado. Perfil não autorizado para esta operação.' });
        }

        next();
    };
}
