const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const SECRET_KEY = "mi_clave_secreta";
const TOKEN_TTL_SECONDS = 60 * 5;

// Generar token
router.post("/token", (req, res) => {
    const { user = "anonimo" } = req.query; // opcional

    const token = jwt.sign({ user }, SECRET_KEY, {
        expiresIn: TOKEN_TTL_SECONDS,
    });

    res.json({
        token,
        expiresInSeconds: TOKEN_TTL_SECONDS,
        issuedAt: new Date().toISOString(),
    });
});

module.exports = router;
