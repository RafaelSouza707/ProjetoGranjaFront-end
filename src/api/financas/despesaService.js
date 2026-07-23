import api from "../axios";

export async function listarDespesas(granjaId, pagina = 1) {
    const response = await api.get("/financas/despesa", {
        params: {
            granja_id: granjaId,
            pagina: pagina
        }
    });
    return response.data;
}

export async function criarDespesa(data, granjaId) {
    const response = await api.post("/financas/despesa",
        data,
        {
            params: {
                granja_id: granjaId
            }
        }
    )
    return response.data;
}

export async function atualizarDespesa(id, granjaId, data) {
    await api.put(`/financas/despesa/${id}`,
        data,
        {
            granja_id: granjaId
        }
    )
}

export async function deletarDespesa(id, granjaId) {
    await api.delete(`/financas/despesa/${id}`, {
        params: {
            granja_id: granjaId
        }
    })
}

export async function cardsGastosGranja(granjaId) {
    const response = await api.get("/financas/cards_gastos_granja", {
        params: {
            granja_id: granjaId
        }
    })
    return response.data;
}

export async function despesaElastica(data) {
    const response = await api.get("/financas/despesa_search", {
        params: { data }
    })
    return response.data;
}