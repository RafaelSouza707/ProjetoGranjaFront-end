import api from "../axios";

export async function listarMortalidade(loteFrangoId, granjaId) {
    const response = await api.get("/granja/mortalidade", {
        params: {
            granja_id: granjaId,
            lote_frango_id: loteFrangoId
        }
    })
    return response.data;
}

export async function criarMortalidade(loteFrangoId, granjaId, data) {
    const response = await api.post("/granja/mortalidade",
        data,
        {
        params:{
            granja_id: granjaId,
            lote_frango_id: loteFrangoId
        },
    })
    return response.data;
}

export async function atualizarMortalidade(id, loteFrangoId, granjaId, data) {
    const response = await api.put(`/granja/mortalidade/${id}`, 
        data,
        {
        params: {
            granja_id: granjaId,
            lote_frango_id: loteFrangoId
        }
    })
    return response.data;
}

export async function deletarMortalidade(loteFrangoId, granjaId, id) {
    await api.delete(`/granja/mortalidade/${id}`,{
        params: {
            granja_id: granjaId,
            lote_frango_id: loteFrangoId
        }
    })
}