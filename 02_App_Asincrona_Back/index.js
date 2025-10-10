const express = require("express");
const cors = require("cors");

const postsRoutes = require("./modules/controller/json.controller");
const authRoutes = require("./modules/controller/auth.controller");
const authMiddleware = require("./modules/middleware/auth.middleware");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes); // Token
app.use("/api/posts", authMiddleware, postsRoutes); // Protegido por token

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
