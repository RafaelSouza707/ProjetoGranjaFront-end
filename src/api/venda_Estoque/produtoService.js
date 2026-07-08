import api from "../axios";

export async function listarProdutos(granjaId) {
    const res = await api.get("/venda_estoque/produto", {
        params: {
            granja_id: granjaId
        }
    })
    return res.data;
}

export async function criarProduto(granjaId, data) {
    const res = await api.post("/venda_estoque/produto",
        data,
        {
            params: {
                granja_id: granjaId
            }
        })

    return res.data;
}

export async function atualizarProduto(id, granjaId, data) {
    const res = await api.put(`/venda_estoque/produto/${id}`,
        data,
        {
            params: {
                granja_id: granjaId
            }
        }
    )
    return res.data;
}

export async function deletarProduto(id, granjaId) {
    await api.delete(`/venda_estoque/produto/${id}`, {
        params: {
            granja_id: granjaId
        }
    })
}
