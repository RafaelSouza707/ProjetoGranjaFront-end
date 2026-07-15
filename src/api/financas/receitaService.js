import api from "../axios";

export async function listarReceitas(granjaId, pagina = 1) {
    const response = await api.get("/financas/receita", {
        params: {
            granja_id: granjaId,
            pagina: pagina
        }
    })
    return response.data;
}

export async function criarReceita(granjaId, data) {
    const response = await api.post("/financas/receita",
        data, {
            params: {
                granja_id: granjaId
            }
        }
    )
    return response.data;
}

export async function atualizarReceita(id, granjaId, data) {
    const response = await api.put(`/financas/receita/${id}`, 
        data, {
            params: {
                granja_id: granjaId
            }
        }
    )
    return response.data;
}

export async function deletarReceita(id, granjaId) {
    await api.delete(`/financas/receita/${id}`, {
        params: {
            granja_id: granjaId
        }
    })
}

export async function cardReceitaGranja(granjaId) {
    const response = await api.get("financas/cards_receitas_granja", {
        params: {
            granja_id: granjaId
        }
    })

    return response.data;
}