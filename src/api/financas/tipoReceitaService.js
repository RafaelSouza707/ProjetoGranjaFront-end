import api from "../axios";

export async function listarTiposReceitas() {
    const response = await api.get("/financas/tipo_receita");
    return response.data;
}

export async function buscarTipoReceita(id) {
    const response = await api.get(`/financas/tipo_receita/${id}`);
    return response.data;
}

export async function criarTipoReceita(data) {
    const response = await api.post("/financas/tipo_receita", data);
    return response.data;
}

export async function atualizarTipoReceita(data, id) {
    const response = await api.put(`/financas/tipo_receita/${id}`, data);
    return response.data;
}

export async function deletarTipoReceita(id) {
    await api.delete(`/financas/tipo_receita/${id}`);
    return "";
}