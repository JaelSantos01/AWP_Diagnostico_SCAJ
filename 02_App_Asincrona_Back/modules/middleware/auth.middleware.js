const jwt = require("jsonwebtoken");

const SECRET_KEY = "mi_clave_secreta"; // ⚠️ debe ser el mismo que en auth.controller.js

function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token missing" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid token" });
        req.user = decoded;
        next();
    });
}

module.exports = authMiddleware;
