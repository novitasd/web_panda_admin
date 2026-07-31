import api from "../api/axios";

export async function getStockByProduct(productId) {
    const { data } = await api.get(`/stock/${productId}`);
    return data;
}

export async function getStock() {
    const { data } = await api.get("/stock");
    return data;
}