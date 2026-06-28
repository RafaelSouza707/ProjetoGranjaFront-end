import api from "../axios";

export async function listarPermissoes() {
    const response = await api.get("/permissoes");
    return response.data;
}

export async function buscarPermissoes(id) {
    const response = await api.get(`/escolaridade/${id}`)
    return response.data;
}

export async function criarPermissoes(data) {
    const response = await api.post("/escolaridade", data)
    return response.data;
}

export async function atualizarPermissoes(id, data) {
    const response = await api.put(`/escolaridade/${id}`, data)
    return response.data;
}

export async function deletarPermissoes(id) {
    const response = await api.delete(`/escolaridade/${id}`)
    return response;
}