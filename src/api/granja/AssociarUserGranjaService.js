import api from "../axios";

export async function fazerAssociacao(data) {
    const res = api.post("/granja/associar_user_granja", data)
    return res.data;
}