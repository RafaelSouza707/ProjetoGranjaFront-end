import api from "../axios";

export async function listarTipoProduto(granjaId) {
    const response = await api.get(`/granja/tipo_produto`, {
        params: {
            granja_id: granjaId
        }
    });
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

export async function deletarTipoProduto(id, data) {
    await api.delete(`/granja/tipo_produto/${id}`, {
        params: {
            granja_id: data.granja_id
        }
    });
    return "";
}