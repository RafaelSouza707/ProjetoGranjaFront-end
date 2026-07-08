import api from "../axios";

export async function listarTipoMovimentacao(granjaId) {
    const response = await api.get(`/venda_estoque/tipo_movimentacao?granja_id=${granjaId}`);
    return response.data;
}

export async function buscarTipoMovimentacao(id) {
    const resposne = await api.get(`/venda_estoque/tipo_movimentacao/${id}`);
    return resposne.data;
}

export async function criarTipoMovimentacao(data) {
    const response = await api.post("/venda_estoque/tipo_movimentacao", data);
    return response.data;
}

export async function atualizarTipoMovimentacao(id, data) {
    const response = await api.put(`/venda_estoque/tipo_movimentacao/${id}`, data);
    return response.data;
}

export async function deletarTipoMovimentacao(id, data) {
    await api.delete(`/venda_estoque/tipo_movimentacao/${id}?granja_id=${data.granja_id}`);
    return "";
}