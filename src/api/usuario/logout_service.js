import api from "../axios";

export async function deslogar() {
    const response = await api.post("/usuarios/logout");
    return response.data;    
}