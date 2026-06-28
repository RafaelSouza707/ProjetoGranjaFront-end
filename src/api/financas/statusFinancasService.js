import api from "../axios";

export async function listarSatus() {
    const response = await api.get("/financas/status_financas");
    return response.data;
}

export async function buscarStatus(id) {
    const response = await api.get(`/financas/status_financas/${id}`)
    return response.data;
}

export async function criarStatus(data) {
    const response = await api.post("/financas/status_financas", data)
    return response.data;
}

export async function atualizarStatus(id, data) {
    const response = await api.put(`/financas/status_financas/${id}`, data)
    return response.data;
}

export async function deletarStatus(id) {
    const response = await api.delete(`/financas/status_financas/${id}`)
    return response;
}