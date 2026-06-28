import api from "../axios";

export async function listarTipoUnidadeMedida() {
    const response = await api.get("/venda_estoque/tipo_unidade_medida");
    return  response.data;
}

export async function buscarTipoUnidadeMedida(id) {
    const response = await api.get(`/venda_estoque/tipo_unidade_medida/${id}`)
    return  response.data;
}

export async function criarTipoUnidadeMedida(data) {
    const response = await api.post("/venda_estoque/tipo_unidade_medida", data);
    return  response.data;
}

export async function atualizarTipoUnidadeMedida(id, data) {
    const response = await api.put(`/venda_estoque/tipo_unidade_medida/${id}`, data)
    return  response.data;
}

export async function deletarTipoUndadeMediada(id) {
    await api.delete(`/venda_estoque/tipo_unidade_medida/${id}`);
    return  "";
}