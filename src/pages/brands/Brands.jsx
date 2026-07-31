import { useEffect, useState } from "react";
import {
    getBrands,
    createBrand,
    updateBrand,
    deleteBrand,
} from "../../services/brand.service";

import { toast } from "react-toastify";

import "./Brands.css";

function Brands() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");

    const [editingBrand, setEditingBrand] = useState(null);

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        loadBrands();
    }, []);

    async function loadBrands() {
        try {
            const data = await getBrands();

            setBrands(data);
        } catch (error) {
            console.error(error);

            toast.error(
                "No se pudieron cargar las marcas."
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
                "Ingresa el nombre de la marca."
            );
            return;
        }

        try {
            setSaving(true);

            if (editingBrand) {
                await updateBrand(
                    editingBrand.id,
                    cleanName
                );

                toast.success(
                    "Marca actualizada correctamente."
                );
            } else {
                await createBrand(cleanName);

                toast.success(
                    "Marca creada correctamente."
                );
            }

            setName("");
            setEditingBrand(null);

            await loadBrands();

        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "No se pudo guardar la marca."
            );
        } finally {
            setSaving(false);
        }
    }

    function handleEdit(brand) {
        setEditingBrand(brand);
        setName(brand.name);
    }

    function handleCancelEdit() {
        setEditingBrand(null);
        setName("");
    }

    async function handleDelete(brand) {
        const confirmed = window.confirm(
            `¿Seguro que deseas eliminar "${brand.name}"?`
        );

        if (!confirmed) return;

        try {
            setDeletingId(brand.id);

            await deleteBrand(brand.id);

            toast.success(
                "Marca eliminada correctamente."
            );

            if (editingBrand?.id === brand.id) {
                handleCancelEdit();
            }

            await loadBrands();

        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "No se pudo eliminar la marca."
            );
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="brands-page">

            <div className="brands-header">
                <div>
                    <h1>Marcas</h1>

                    <p>
                        Administra las marcas disponibles
                        para tus productos.
                    </p>
                </div>
            </div>

            <div className="brands-content">

                <form
                    className="brand-form"
                    onSubmit={handleSubmit}
                >
                    <h2>
                        {editingBrand
                            ? "Editar marca"
                            : "Nueva marca"}
                    </h2>

                    <div className="brand-form-group">
                        <label>Nombre</label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Ej. Adidas"
                            maxLength={100}
                        />
                    </div>

                    <div className="brand-form-actions">

                        {editingBrand && (
                            <button
                                type="button"
                                className="brand-cancel-btn"
                                onClick={handleCancelEdit}
                            >
                                Cancelar
                            </button>
                        )}

                        <button
                            type="submit"
                            className="brand-save-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "Guardando..."
                                : editingBrand
                                  ? "Guardar cambios"
                                  : "+ Agregar marca"}
                        </button>

                    </div>
                </form>

                <div className="brands-list">

                    <div className="brands-list-header">
                        <h2>Marcas registradas</h2>

                        <span>
                            {brands.length} marcas
                        </span>
                    </div>

                    {loading ? (
                        <p>Cargando marcas...</p>
                    ) : brands.length === 0 ? (
                        <div className="brands-empty">
                            No hay marcas registradas.
                        </div>
                    ) : (
                        <div className="brands-table-wrapper">

                            <table className="brands-table">

                                <thead>
                                    <tr>
                                        <th>Marca</th>
                                        <th>Slug</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {brands.map((brand) => (
                                        <tr key={brand.id}>

                                            <td>
                                                <strong>
                                                    {brand.name}
                                                </strong>
                                            </td>

                                            <td>
                                                {brand.slug}
                                            </td>

                                            <td>
                                                <div className="brand-actions">

                                                    <button
                                                        type="button"
                                                        className="brand-edit-btn"
                                                        onClick={() =>
                                                            handleEdit(brand)
                                                        }
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="brand-delete-btn"
                                                        disabled={
                                                            deletingId ===
                                                            brand.id
                                                        }
                                                        onClick={() =>
                                                            handleDelete(brand)
                                                        }
                                                    >
                                                        {deletingId ===
                                                        brand.id
                                                            ? "Eliminando..."
                                                            : "Eliminar"}
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Brands;