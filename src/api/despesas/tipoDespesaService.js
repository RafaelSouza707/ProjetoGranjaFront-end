import api from "../axios";

export async function listarTiposDespesas() {
    const response = await api.get("/tipo_despesa");
    return response.data;
}

export async function buscarTipoDespesa(id) {
    const response = await api.get(`/tipo_despesa/${id}`)
    return response.data;
}

export async function criarTipoDespesa(data) {
    const response = await api.post("/tipo_despesa", data)
    return response.data;
}

export async function atualizarTipoDespesa(id, data) {
    const response = await api.put(`/tipo_despesa/${id}`, data)
    return response.data;
}

export async function deletarTipoDespesa(id) {
    const response = await api.delete(`/tipo_despesa/${id}`)
    return response;
}