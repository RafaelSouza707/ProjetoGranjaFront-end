import api from "../axios";

export async function listarTiposDespesas() {
    const response = await api.get("/financas/tipo_despesa");
    return response.data;
}

export async function buscarTipoDespesa(id) {
    const response = await api.get(`/financas/tipo_despesa/${id}`);
    return response.data;
}

export async function criarTipoDespesa(data) {
    const response = await api.post("/financas/tipo_despesa", data);
    return response.data;
}

export async function atualizarTipoDespesa(id, data) {
    const response = await api.put(`/financas/tipo_despesa/${id}`, data);
    return response.data;
}

export async function deletarTipoDespesa(id) {
    await api.delete(`/financas/tipo_despesa/${id}`);
    return "";
}