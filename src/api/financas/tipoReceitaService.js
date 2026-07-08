import api from "../axios";

export async function listarTiposReceitas(granjaId) {
    const response = await api.get("/financas/tipo_receita", {
        params: {
            granja_id: granjaId
        }
    });
    return response.data;
}

export async function criarTipoReceita(granjaId, data) {
    const response = await api.post("/financas/tipo_receita", 
        data, {
            params: {
                granja_id: granjaId
            }
        });
    return response.data;
}

export async function atualizarTipoReceita(id, data) {
    const response = await api.put(`/financas/tipo_receita/${id}`, 
        data, {
            params: {
                granja_id: granjaId
            }
        });
    return response.data;
}

export async function deletarTipoReceita(id, granjaId) {
    await api.delete(`/financas/tipo_receita/${id}`, {
        params: {
            granja_id: granjaId
        }
    });
    return "";
}