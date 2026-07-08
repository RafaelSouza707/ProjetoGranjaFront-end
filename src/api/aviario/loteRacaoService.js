import api from "../axios";

export async function listarLoteRacoes(granjaId) {
  const response = await api.get("/granja/lote_racao", {
    params: {
      granja_id: granjaId,
    },
  });
  return response.data;
}

export async function buscarLoteRacao(id) {
  const response = await api.get(`/granja/lote_racao/${id}`);
  return response.data;
}

export async function criarLoteRacao(granjaId, data) {
  const response = await api.post(
    "/granja/lote_racao",
    data,
    {
      params: {
        granja_id: granjaId,
      },
    }
  );
  return response.data;
}

export async function atualizarLoteRacao(id, granjaId, data) {
  const response = await api.put(
    `/granja/lote_racao/${id}`,
    data,
    {
      params: {
        granja_id: granjaId,
      },
    }
  );
  return response.data;
}

export async function deletarLoteRacao(id, granjaId) {
  await api.delete(`/granja/lote_racao/${id}`, {
    params: {
      granja_id: granjaId,
    },
  });
}


export async function listarCardsLoteRacao(granjaId) {
    const res = await api.get("/granja/cards_lote_racao", {
      params: {
        granja_id: granjaId
      }
    })
    return res.data;
}