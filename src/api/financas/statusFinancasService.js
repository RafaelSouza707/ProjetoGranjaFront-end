import api from "../axios";

export async function listarStatusFinancas(granjaId) {
    const response = await api.get("/financas/status_financas", {
        params: {
            granja_id: granjaId
        }
    });
    console.log(response)
    return response.data;
}

export async function buscarStatusFinancas(id) {
    const response = await api.get(`/financas/status_financas/${id}`)
    return response.data;
}

export async function criarStatusFinancas(data) {
    const response = await api.post("/financas/status_financas", data)
    return response.data;
}

export async function atualizarStatusFinancas(id, data) {
    const response = await api.put(`/financas/status_financas/${id}`, data)
    return response.data;
}

export async function deletarStatusFinancas(id, granjaId) {
    await api.delete(`/financas/status_financas/${id}`, {
        params: {
            granja_id: granjaId
        }
    })
}