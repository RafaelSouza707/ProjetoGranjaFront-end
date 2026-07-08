import api from "../axios";

export async function listarLoteFrangos(granjaId){
    const response = await api.get(`/granja/lote_frango?granja_id=${granjaId}`);
    return response.data;
}

export async function buscarLoteFrango(id) {
    const response = await api.get(`/granja/lote_frango/${id}`);
    return response.data;
}

export async function criarLoteFrango(data) {
    const response = await api.post("/granja/lote_frango", data);
    return response.data;
}

export async function atualizarLoteFrango(id, data) {
    const response = await api.put(`/granja/lote_frango/${id}`, data);
    return response.data;
}

export async function deletarLoteFrango(id) {
    await api.delete(`/granja/lote_frango/${id}`);
    return "";
}

export async function cardsLoteFrango(granjaId, loteFrangoId) {
    const response = await api.get("granja/cards_lote_frango", {
        params: {
            granja_id: granjaId,
            lote_frango_id: loteFrangoId
        }
    });
    return response.data;
}