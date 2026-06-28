import api from "../axios";

export async function listarTipoRacao() {
    const response = await api.get("/granja/tipo_racao");
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
    console.log(id, data)
    const response = await api.put(`/granja/tipo_racao/${id}`, data);
    console.log(response.data)
    return response.data;
}

export async function deletarTipoRacao(id) {
    const response = await api.delete(`/granja/tipo_racao/${id}`);
    return "";
}