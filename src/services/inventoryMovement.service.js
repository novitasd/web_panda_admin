import api from "../api/axios";

export async function createInventoryMovement({
    productSizeId,
    type,
    quantity,
    reason,
}) {
    const { data } = await api.post("/movements", {
        productSizeId,
        type,
        quantity,
        reason,
    });

    return data;
}