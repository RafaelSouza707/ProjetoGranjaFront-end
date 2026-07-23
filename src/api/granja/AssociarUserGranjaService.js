import api from "../axios";

export async function fazerAssociacao(data, granjaId) {
    const res = api.post("/granja/associar_user_granja", 
        data, {
            params: {
                granja_id: granjaId
            }
        }
    )
    return res.data;
}


export async function removerAssociacaoGranja(id, granjaId) {
    await api.delete(`/granja/associar_user_granja/${id}`, {
        params: {
            granja_id: granjaId
        }
    })
}