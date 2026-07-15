import api from "../axios";

export async function listarTipoUnidadeMedida(granjaId) {
    const response = await api.get(`/venda_estoque/tipo_unidade_medida`, {
        params: {
            granja_id: granjaId
        }
    });
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

export async function deletarTipoUndadeMediada(id, data) {
    await api.delete(`/venda_estoque/tipo_unidade_medida/${id}`, {
        params: {
            granja_id: data.granja_id
        }
    });
    return  "";
}