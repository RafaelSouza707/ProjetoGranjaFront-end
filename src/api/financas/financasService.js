import api from "../axios";

export async function listarCardsFinancas(granjaId) {
    const res = await api.get("financas/cards_financas", {
        params: {
            granja_id: granjaId
        }
    })
    return res.data;
}