import api from "../api/axios";

/**
 * Obtener todas las órdenes.
 */
export const getOrders = async () => {
    const { data } = await api.get("/orders");
    return data;
};

/**
 * Obtener una orden por ID.
 */
export const getOrderById = async (id) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
};