import api from "../api/axios";

/**
 * Obtener categorías
 */
export async function getCategories() {
    const { data } = await api.get("/categories");

    return data;
}

/**
 * Crear categoría
 */
export async function createCategory(name) {
    const { data } = await api.post(
        "/categories",
        {
            name,
        }
    );

    return data;
}

/**
 * Actualizar categoría
 */
export async function updateCategory(id, name) {
    const { data } = await api.put(
        `/categories/${id}`,
        {
            name,
        }
    );

    return data;
}

/**
 * Eliminar categoría
 */
export async function deleteCategory(id) {
    const { data } = await api.delete(
        `/categories/${id}`
    );

    return data;
}