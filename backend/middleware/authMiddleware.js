function allowRoles(...allowedRoles) {
    return (req, res, next) => {
        const role = req.headers['role'];

        if(!role || !allowedRoles.includes(role)) {
            return res.status(403).json({ error: "Access denied" });
        }

        next();
    };
}

module.exports = { allowRoles }