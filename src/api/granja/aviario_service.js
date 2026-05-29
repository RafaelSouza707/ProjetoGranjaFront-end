import api from "../axios";

export async function listarAviario() {
    const response = await api.get("/aviario");
    return response.data;
}

export async function buscarAviario(id) {
    const response = await api.get(`/aviario/${id}`)
    return response.data;
}

export async function criarAviario(data) {
    const response = await api.post("/aviario", data)
    return response.data;
}

export async function atualizarAviario(id, data) {
    const response = await api.put(`/aviario/${id}`, data)
    return response.data;
}

export async function deletarAviario(id) {
    const response = await api.delete(`/aviario/${id}`)
    return response;
}