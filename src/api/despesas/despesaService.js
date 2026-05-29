import api from "../axios";

export async function listarDespesas() {
    const response = await api.get("/despesa");
    return response.data;
}

export async function buscarDespesa(id) {
    const response = await api.get(`/despesa/${id}`)
    return response.data;
}

export async function criarDespesa(data) {
    const response = await api.post("/despesa", data)
    return response.data;
}

export async function atualizarDespesa(id, data) {
    const response = await api.put(`/despesa/${id}`, data)
    return response.data;
}

export async function deletarDespesa(id) {
    const response = await api.delete(`/despesa/${id}`)
    return response;
}