import api from "../api/axios";

/**
 * Obtener todas las marcas
 */
export async function getBrands() {
    const { data } = await api.get("/brands");

    return data;
}

/**
 * Crear marca
 */
export async function createBrand(name) {
    const { data } = await api.post("/brands", {
        name,
    });

    return data;
}

/**
 * Actualizar marca
 */
export async function updateBrand(id, name) {
    const { data } = await api.put(
        `/brands/${id}`,
        {
            name,
        }
    );

    return data;
}

/**
 * Eliminar marca
 */
export async function deleteBrand(id) {
    const { data } = await api.delete(
        `/brands/${id}`
    );

    return data;
}