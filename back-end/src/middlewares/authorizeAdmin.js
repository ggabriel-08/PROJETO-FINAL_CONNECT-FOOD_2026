export function authorizeAdmin(req, res, next) {
    if (req.user.tipo ==! "admin") {
        return res.status(403).json({ error: "Acesso negado!" });
    }

    next();
}