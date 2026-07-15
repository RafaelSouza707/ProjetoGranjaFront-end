import api from "../axios";

export async function listarTipoRacao(granjaId) {
    const response = await api.get(`/granja/tipo_racao`, {
        params: {
            granja_id: granjaId
        }
    });
    return response.data;
}

export async function buscarTipoRacao(id) {
    const response = await api.get(`/granja/tipo_racao/${id}`);
    return response.data;
}

export async function criarTipoRacao(data) {
    const response = await api.post("/granja/tipo_racao", data);
    return response.data;
}

export async function atualizarTipoRacao(id, data) {
    const response = await api.put(`/granja/tipo_racao/${id}`, data);
    return response.data;
}

export async function deletarTipoRacao(id, data) {
    await api.delete(`/granja/tipo_racao/${id}`, {
        params: {
            granja_id: data.granja_id
        }
    });
    return "";
}