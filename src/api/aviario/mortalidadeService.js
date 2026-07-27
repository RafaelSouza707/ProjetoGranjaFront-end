import api from "../axios";

export async function listarMortalidade(loteFrangoId, granjaId, params = {}) {
    const response = await api.get(`/granja/mortalidade`, {
        params: {
        granja_id: granjaId,
        lotes_frango: loteFrangoId,
        ...params
        }
    })
    return response.data
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

export async function deletarMortalidade(granjaId, id) {
    await api.delete(`/granja/mortalidade/${id}`,{
        params: {
            granja_id: granjaId,
        }
    })
}

export async function listarGraficoMortalidadeGranja(granjaId) {
    const res = await api.get("/granja/grafico_mortalidade_granja", {
        params: {
            granja_id: granjaId
        }
    })
    return res.data;
}