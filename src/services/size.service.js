import api from "../api/axios";

export async function getSizes() {
    const { data } = await api.get("/sizes");
    return data;
}

export async function createSize(name) {
    const { data } = await api.post("/sizes", {
        name,
    });

    return data;
}