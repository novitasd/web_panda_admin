import { useEffect, useState } from "react";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../../services/category.service";

import { toast } from "react-toastify";

import "./Categories.css";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            const data = await getCategories();

            setCategories(data);
        } catch (error) {
            console.error(error);

            toast.error(
                "No se pudieron cargar las categorías."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const cleanName = name.trim();

        if (!cleanName) {
            toast.error(
                "Ingresa el nombre de la categoría."
            );
            return;
        }

        try {
            setSaving(true);

            if (editingCategory) {
                await updateCategory(
                    editingCategory.id,
                    cleanName
                );

                toast.success(
                    "Categoría actualizada correctamente."
                );
            } else {
                await createCategory(cleanName);

                toast.success(
                    "Categoría creada correctamente."
                );
            }

            setName("");
            setEditingCategory(null);

            await loadCategories();

        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "No se pudo guardar la categoría."
            );
        } finally {
            setSaving(false);
        }
    }

    function handleEdit(category) {
        setEditingCategory(category);
        setName(category.name);
    }

    function handleCancelEdit() {
        setEditingCategory(null);
        setName("");
    }

    async function handleDelete(category) {
        const confirmed = window.confirm(
            `¿Seguro que deseas eliminar "${category.name}"?`
        );

        if (!confirmed) return;

        try {
            setDeletingId(category.id);

            await deleteCategory(category.id);

            toast.success(
                "Categoría eliminada correctamente."
            );

            if (
                editingCategory?.id === category.id
            ) {
                handleCancelEdit();
            }

            await loadCategories();

        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "No se pudo eliminar la categoría."
            );
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="categories-page">

            <div className="categories-header">
                <div>
                    <h1>Categorías</h1>

                    <p>
                        Administra las categorías disponibles
                        para tus productos.
                    </p>
                </div>
            </div>

            <div className="categories-content">

                {/* CREAR / EDITAR */}

                <form
                    className="category-form"
                    onSubmit={handleSubmit}
                >
                    <h2>
                        {editingCategory
                            ? "Editar categoría"
                            : "Nueva categoría"}
                    </h2>

                    <div className="category-form-group">

                        <label>Nombre</label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Ej. Jordan Collection"
                            maxLength={100}
                        />

                    </div>

                    <div className="category-form-actions">

                        {editingCategory && (
                            <button
                                type="button"
                                className="category-cancel-btn"
                                onClick={handleCancelEdit}
                            >
                                Cancelar
                            </button>
                        )}

                        <button
                            type="submit"
                            className="category-save-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "Guardando..."
                                : editingCategory
                                  ? "Guardar cambios"
                                  : "+ Agregar categoría"}
                        </button>

                    </div>

                </form>

                {/* LISTA */}

                <div className="categories-list">

                    <div className="categories-list-header">

                        <h2>
                            Categorías registradas
                        </h2>

                        <span>
                            {categories.length} categorías
                        </span>

                    </div>

                    {loading ? (

                        <p>Cargando categorías...</p>

                    ) : categories.length === 0 ? (

                        <div className="categories-empty">
                            No hay categorías registradas.
                        </div>

                    ) : (

                        <div className="categories-table-wrapper">

                            <table className="categories-table">

                                <thead>
                                    <tr>
                                        <th>Categoría</th>
                                        <th>Slug</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {categories.map(
                                        (category) => (
                                            <tr key={category.id}>

                                                <td>
                                                    <strong>
                                                        {category.name}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {category.slug}
                                                </td>

                                                <td>
                                                    <div className="category-actions">

                                                        <button
                                                            type="button"
                                                            className="category-edit-btn"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    category
                                                                )
                                                            }
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="category-delete-btn"
                                                            disabled={
                                                                deletingId ===
                                                                category.id
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    category
                                                                )
                                                            }
                                                        >
                                                            {deletingId ===
                                                            category.id
                                                                ? "Eliminando..."
                                                                : "Eliminar"}
                                                        </button>

                                                    </div>
                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Categories;