const axios = require("axios");

const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

module.exports = {
    // Obtener todos los posts
    getAll: async () => {
        const res = await axios.get(BASE_URL);
        return res.data;
    },

    // Obtener post por id
    getById: async (id) => {
        const res = await axios.get(`${BASE_URL}/${id}`);
        return res.data;
    },

    // Crear un nuevo post (jsonplaceholder siempre devuelve id=101)
    create: async (post) => {
        const res = await axios.post(BASE_URL, post);
        return res.data;
    },

    // Actualizar un post (jsonplaceholder devuelve lo que mandes)
    update: async (id, post) => {
        const res = await axios.put(`${BASE_URL}/${id}`, post);
        return res.data;
    },

    // Eliminar un post (jsonplaceholder devuelve objeto vacío)
    remove: async (id) => {
        const res = await axios.delete(`${BASE_URL}/${id}`);
        return res.data;
    },
};
