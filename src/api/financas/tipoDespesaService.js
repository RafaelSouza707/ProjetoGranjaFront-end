import api from "../axios";

export async function listarTiposDespesa(granjaId) {
    const response = await api.get(`/financas/tipo_despesa?granja_id=${granjaId}`);
    return response.data;
}

export async function buscarTipoDespesa(id) {
    const response = await api.get(`/financas/tipo_despesa/${id}`);
    return response.data;
}

export async function criarTipoDespesa(data) {
    const response = await api.post("/financas/tipo_despesa", data);
    return response.data;
}

export async function atualizarTipoDespesa(id, data) {
    const response = await api.put(`/financas/tipo_despesa/${id}`, data);
    return response.data;
}

export async function deletarTipoDespesa(id, data) {
    await api.delete(
        `/financas/tipo_despesa/${id}`,{
            params: {
                granja_id: data.granja_id
            }
        }
    )

    return ""
}