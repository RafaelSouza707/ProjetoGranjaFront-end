import api from "../axios";

export async function listarEscolaridade() {
    const response = await api.get("/escolaridade");
    return response.data;
}

export async function buscarEscolaridade(id) {
    const response = await api.get(`/escolaridade/${id}`)
    return response.data;
}

export async function criarEscolaridade(data) {
    const response = await api.post("/escolaridade", data)
    return response.data;
}

export async function atualizarEscolaridade(id, data) {
    const response = await api.put(`/escolaridade/${id}`, data)
    return response.data;
}

export async function deletarEscolaridade(id) {
    const response = await api.delete(`/escolaridade/${id}`)
    return response;
}