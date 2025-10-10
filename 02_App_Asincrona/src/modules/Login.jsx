import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from "react-bootstrap";

function Posts() {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [searchId, setSearchId] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [token, setToken] = useState(null);

    const API_BASE = "http://localhost:4000/api";

    // Generar token
    const generarToken = () => {
        fetch(`${API_BASE}/auth/token`, { method: "POST" })
            .then((res) => res.json())
            .then((data) => {
                setToken(data.token);
                alert("Token generado con éxito");
            })
            .catch(() => alert("Error al generar token"));
    };

    const fetchPosts = () => {
        fetch(`${API_BASE}/posts`, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
            .then((res) => {
                if (res.status === 401) {
                    alert("No autorizado: genera un token válido");
                    setPosts([]);
                    return [];
                }
                return res.json();
            })
            .then((data) => Array.isArray(data) && setPosts(data))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        if (token) fetchPosts();
    }, [token]);

    const handleAddPost = (e) => {
        e.preventDefault();
        fetch(`${API_BASE}/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ title, body, userId: 1 }),
        })
            .then((res) => res.json())
            .then((newPost) => {
                setPosts([newPost, ...posts]);
                setTitle("");
                setBody("");
                setShowModal(false);
            });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        fetch(`${API_BASE}/posts/${editingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ id: editingId, title, body, userId: 1 }),
        })
            .then((res) => res.json())
            .then((updatedPost) => {
                setPosts(posts.map((p) => (p.id === editingId ? updatedPost : p)));
                setTitle("");
                setBody("");
                setEditingId(null);
                setShowModal(false);
            });
    };

    const handleDelete = (id) => {
        fetch(`${API_BASE}/posts/${id}`, {
            method: "DELETE",
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
            .then(() => setPosts(posts.filter((post) => post.id !== id)));
    };

    const handleEdit = (id) => {
        const post = posts.find((p) => p.id === id);
        setTitle(post.title);
        setBody(post.body);
        setEditingId(id);
        setShowModal(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetch(`${API_BASE}/posts/${searchId}`, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
            .then((res) => res.json())
            .then((data) => setPosts([data]))
            .catch(() => alert("No encontrado"));
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-light mb-4">
                <div className="container-fluid">
                    <a className="navbar-brand fw-bold">Gestión de Posts</a>
                    <div className="d-flex">
                        <button
                            className="btn btn-success me-3"
                            onClick={generarToken}
                        >
                            Generar Token
                        </button>
                        <button
                            className="btn btn-primary me-3"
                            onClick={() => { setEditingId(null); setTitle(""); setBody(""); setShowModal(true); }}
                            disabled={!token}
                        >
                            Agregar
                        </button>
                        <form className="d-flex" onSubmit={handleSearch}>
                            <input className="form-control me-2" type="search" placeholder="Buscar por ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
                            <button className="btn btn-outline-success" type="submit" disabled={!token}> Buscar </button>
                        </form>
                    </div>
                </div>
            </nav>

            <div className="container">
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingId ? "Editar Post" : "Agregar Nuevo Post"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={editingId ? handleUpdate : handleAddPost}>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <textarea className="form-control" placeholder="Contenido" value={body} onChange={(e) => setBody(e.target.value)} rows="3" required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">
                                {editingId ? "Actualizar" : "Agregar"}
                            </button>
                        </form>
                    </Modal.Body>
                </Modal>

                <div className="row">
                    {posts.map((post) => (
                        <div key={`${post.id}-${Math.random()}`} className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text">{post.body}</p>
                                    <button onClick={() => handleEdit(post.id)} className="btn btn-warning btn-sm me-2">Editar</button>
                                    <button onClick={() => handleDelete(post.id)} className="btn btn-danger btn-sm">Eliminar</button>
                                </div>
                                <div className="card-footer text-muted">ID: {post.id}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Posts;
