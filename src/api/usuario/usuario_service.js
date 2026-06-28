import api from "../axios";

export async function listarUsuario() {
    const response = await api.get("/usuarios/usuario");
    return response.data;
}

export async function buscarUsuario(id) {
    const response = await api.get(`/usuarios/usuario/${id}`)
    return response.data;
}

export async function criarUsuario(data) {
    const response = await api.post("/usuarios/usuario", data)
    return response.data;
}

export async function atualizarUsuario(id, data) {
    const response = await api.put(`/usuarios/usuario/${id}`, data)
    return response.data;
}

export async function deletarUsuario(id) {
    await api.delete(`/usuarios/usuario/${id}`)
}

export async function loginUsuario(data) {
    console.log(data)
    const response = await api.post("/usuarios/login", data);
    console.log(response)
    return response.data;
}

export async function me(data) {
    const response = await api.get("/usuarios/login", data);
    return response.data;
}