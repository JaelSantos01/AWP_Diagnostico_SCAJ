const express = require("express");
const router = express.Router();
const postsService = require("../service/json.service");

// Obtener todos
router.get("/", async (req, res) => {
    try {
        const data = await postsService.getAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener posts" });
    }
});

// Obtener por id
router.get("/:id", async (req, res) => {
    try {
        const data = await postsService.getById(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el post" });
    }
});

// Crear
router.post("/", async (req, res) => {
    try {
        const data = await postsService.create(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el post" });
    }
});

// Actualizar
router.put("/:id", async (req, res) => {
    try {
        const data = await postsService.update(req.params.id, req.body);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el post" });
    }
});

// Eliminar
router.delete("/:id", async (req, res) => {
    try {
        await postsService.remove(req.params.id);
        res.json({ message: "Post eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el post" });
    }
});

module.exports = router;
