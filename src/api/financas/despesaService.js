import api from "../axios";

export async function listarDespesas() {
    const response = await api.get("/financas/despesa");
    return response.data;
}

export async function buscarDespesa(id) {
    const response = await api.get(`/financas/despesa/${id}`)
    return response.data;
}

export async function criarDespesa(data) {
    const response = await api.post("/financas/despesa", data)
    return response.data;
}

export async function atualizarDespesa(id, data) {
    await api.put(`/financas/despesa/${id}`, data)
}

export async function deletarDespesa(id) {
    await api.delete(`/financas/despesa/${id}`)
}

export async function cardsGastos() {
    const response = await api.get("/financas/cards_gastos")
    return response.data;
}

export async function despesaElastica(data) {
    const response = await api.get("/financas/despesa_search", {
        params: { data }
    })
    return response.data;
}