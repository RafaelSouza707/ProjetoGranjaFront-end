import api from "../axios";

export async function listarStatusFrango(granjaId) {
    const response = await api.get(`/granja/status_lote_frango?granja_id=${granjaId}`);
    return response.data;
}

export async function buscarstatusLoteFrango(id) {
    const response = await api.get(`/granja/status_lote_frango/${id}`);
    return response.data;
}

export async function criarStatusLoteFrango(data) {
    const response = await api.post("/granja/status_lote_frango", data);
    return response.data;
}

export async function atualizarStatusLoteFrango(id, data) {
    const response = await api.put(`/granja/status_lote_frango/${id}`, data)
    return response.data;
}

export async function deletarStatusLoteFrango(id, data){
    await api.delete(`/granja/status_lote_frango/${id}?granja_id=${data.granja_id}`);
    return "";
}