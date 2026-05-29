import api from "../axios";

export async function listarControleVacinas() {
    const response = await api.get("/controle_vacinas");
    return response.data;
}

export async function buscarControleVacinas(id) {
    const response = await api.get(`/controle_vacinas/${id}`)
    return response.data;
}

export async function criarControleVacinas(data) {
    const response = await api.post("/controle_vacinas", data)
    return response.data;
}

export async function atualizarControleVacinas(id, data) {
    const response = await api.put(`/controle_vacinas/${id}`, data)
    return response.data;
}

export async function deletarControleVacinas(id) {
    const response = await api.delete(`/controle_vacinas/${id}`)
    return response;
}