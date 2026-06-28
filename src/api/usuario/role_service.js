import api from "../axios";

export async function listarRole() {
    const response = await api.get("/role");
    return response.data;
}

export async function buscarRole(id) {
    const response = await api.get(`/role/${id}`)
    return response.data;
}

export async function criarRole(data) {
    const response = await api.post("/role", data)
    return response.data;
}

export async function atualizarRole(id, data) {
    const response = await api.put(`/role/${id}`, data)
    return response.data;
}

export async function deletarRole(id) {
    const response = await api.delete(`/role/${id}`)
    return response;
}