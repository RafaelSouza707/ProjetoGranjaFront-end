import api from "../axios";

export async function listarTipoProduto() {
    const response = await api.get("/granja/tipo_produto");
    return response.data;
}

export async function buscarTipoProduto(id) {
    const response = await api.get(`/granja/tipo_produto/${id}`);
    return response.data;
}

export async function criarTipoProduto(data) {
    const response = await api.post("/granja/tipo_produto", data);
    return response.data;
}

export async function atualizarTipoProduto(id, data) {
    const response = await api.put(`/granja/tipo_produto/${id}`, data);
    return response.data;
}

export async function deletarTipoProduto(id) {
    await api.delete(`/granja/tipo_produto/${id}`);
    return "";
}