import api from "../axios";

export async function listarProducaoLote(loteFrangoId, granjaId, pagina = 1) {
    const response = await api.get("/venda_estoque/producao", {
        params: {
            granja_id: granjaId,
            lote_frango_id: loteFrangoId,
            pagina: pagina
        }
    })
    return response.data;
}

export async function criarProducaoLote(loteFrangoId, granjaId, data) {
    const response = await api.post("/venda_estoque/producao",
        data,
        {
            params: {
                granja_id: granjaId,
                lote_frango_id: loteFrangoId
            }
        }
    )
    return response.data;
}

export async function atualizarProducaoLote(id, loteFrangoId, granjaId, data) {
    const response = await api.put(`/venda_estoque/producao/${id}`,
        data,
        {
            params: {
                granja_id: granjaId,
                lote_frango_id: loteFrangoId
            }
        }
    )
    return response.data
}

export async function deletarProducaoLote(id, loteFrangoId, granjaId) {
    await api.delete(`/venda_estoque/producao/${id}`, {
        params: {
            granja_id: granjaId,
            lote_frango_id: loteFrangoId
        }
    })
}