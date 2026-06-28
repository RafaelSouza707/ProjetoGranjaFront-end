import api from "../axios";

export async function listarTipoVenda() {
    const response = await api.get("/venda_estoque/tipo_venda");
    return response.data;
}

export async function buscarTipoVenda(id) {
    const resposne = await api.get(`/venda_estoque/tipo_venda/${id}`);
    return resposne.data;
}

export async function criarTipoVenda(data) {
    const response = await api.post("/venda_estoque/tipo_venda", data);
    return response.data;
}

export async function atualizarTipoVenda(id, data) {
    const resposne = await api.put(`/venda_estoque/tipo_venda/${id}`, data);
    return resposne.data;
}

export async function deletarTipoVenda(id) {
    await api.delete(`/venda_estoque/tipo_venda/${id}`);
    return "";
}