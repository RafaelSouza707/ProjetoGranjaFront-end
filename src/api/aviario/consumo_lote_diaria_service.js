import api from "../axios";

export async function listarConsumoLoteDiario() {
    const response = await api.get("/granja/consumo_lote_diario");
    return response.data;
}

export async function buscarConsumoLoteDiario(id) {
    const response = await api.get(`/granja/consumo_lote_diario/${id}`)
    return response.data;
}

export async function criarConsumoLoteDiario(data) {
    const response = await api.post("/granja/consumo_lote_diario", data)
    return response.data;
}

export async function atualizarConsumoLoteDiario(id, data) {
    const response = await api.put(`/granja/consumo_lote_diario/${id}`, data)
    return response.data;
}

export async function deletarConsumoLoteDiario(id) {
    const response = await api.delete(`/granja/consumo_lote_diario/${id}`)
    return response;
}