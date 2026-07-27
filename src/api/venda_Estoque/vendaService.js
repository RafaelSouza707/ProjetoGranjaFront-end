import api from "../axios";

export async function listarVendas(granjaId, params) {
    const response = await api.get(`/venda_estoque/venda`, {
        params: {
            granja_id: granjaId,
            ...params
            }
    })
    return response.data
}

export async function criarVenda(granjaId, data) {
    const res = await api.post("venda_estoque/venda",
        data, {
            params: {
                granja_id: granjaId
            }
        }
    )
    return res.data;
}

export async function atualizarVenda(id, granjaId, data) {
    const res = await api.put(`venda_estoque/venda/${id}`,
        data, {
            params: {
                granja_id: granjaId
            }
        }
    )
    return res.data;
}

export async function deletarVenda(id, granjaId) {
    await api.delete(`venda_estoque/venda/${id}`, {
        params: {
            granja_id: granjaId
        }
    })
}