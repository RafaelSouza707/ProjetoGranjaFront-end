import api from "../axios";

export async function listarConsumoLoteDiario(loteFrangoId, granjaId) {
    const response = await api.get("/granja/consumo_lote_diaria", {
        params: {
            granja_id: granjaId,
            lote_frango_id: loteFrangoId,
        }
    });
    return response.data;
}

export async function buscarConsumoLoteDiario(id) {
    const response = await api.get(`/granja/consumo_lote_diaria/${id}`)
    return response.data;
}

export async function criarConsumoLoteDiario(loteFrangoId, granjaId, data) {
    const response = await api.post("/granja/consumo_lote_diaria", data, {
        params: {
            granja_id: granjaId,
            lote_frango_id: loteFrangoId,
        }
    })
    return response.data;
}

export async function atualizarConsumoLoteDiario(id, loteFrangoId, granjaId, data) {
    const response = await api.put(`/granja/consumo_lote_diaria/${id}`, data, {
        params: {
            granja_id: granjaId,
            lote_frango_id: loteFrangoId,
        }
    })
    return response.data;
}

export async function deletarConsumoLoteDiario(loteFrangoId, granjaId, id) {
    const response = await api.delete(`/granja/consumo_lote_diaria/${id}`, {
        params: {
            granja_id: granjaId,
            lote_frango_id: loteFrangoId,
        }
    })
    return response;
}
