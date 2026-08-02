import api from "../axios";

export async function listarLoteFrangos(granjaId){
    const response = await api.get(`/granja/lote_frango?granja_id=${granjaId}`);
    console.log(response.data)
    return response.data;
}

export async function buscarLoteFrango(loteFrangoId) {
    const response = await api.get("/granja/lote_frango", {
        params: {
            lote_frango_id: loteFrangoId
        }
    });
    return response.data;
}

export async function criarLoteFrango(data, granjaId) {
    const response = await api.post("/granja/lote_frango", 
        data, {
            params: {
                granja_id: granjaId
            }
        }
    );
    return response.data;
}

export async function atualizarLoteFrango(id, data, granjaId) {
    const response = await api.put(`/granja/lote_frango/${id}`,
        data, {
            params: {
                granja_id: granjaId
            }
        }
    );
    return response.data;
}

export async function deletarLoteFrango(id, granjaId) {
    await api.delete(`/granja/lote_frango/${id}`, {
        params: {
            granja_id: granjaId
        }
    });
    return "";
}

export async function cardsLoteFrango(granjaId, loteFrangoId) {
    const response = await api.get("granja/cards_lote_frango", {
        params: {
            granja_id: granjaId,
            lote_frango_id: loteFrangoId
        }
    });
    return response.data;
}