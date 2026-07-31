import api from "../api/axios";

export async function createProductSize(productId, sizeId) {
    const { data } = await api.post("/product-sizes", {
        productId,
        sizeId,
    });

    return data;
}