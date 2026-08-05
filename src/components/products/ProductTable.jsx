import { FiEdit2, FiTrash2 } from "react-icons/fi";
import "./ProductTable.css";

function ProductTable({
    products,
    onEdit,
    onDelete,
}) {
    return (
        <div className="product-table-wrapper">

            <table className="product-table">

                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Marca</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>

                    {products.map((product) => (

                        <tr key={product.id}>

                            <td data-label="Nombre">
                                {product.name}
                            </td>

                            <td data-label="Marca">
                                {product.brand?.name ?? "-"}
                            </td>

                            <td data-label="Categoría">
                                {product.category?.name ?? "-"}
                            </td>

                            <td data-label="Precio">
                                S/ {product.price}
                            </td>

                            <td data-label="Estado">
                                <span
                                    className={
                                        product.active
                                            ? "status active"
                                            : "status inactive"
                                    }
                                >
                                    {product.active
                                        ? "Activo"
                                        : "Inactivo"}
                                </span>
                            </td>

                            <td
                                className="actions"
                                data-label="Acciones"
                            >
                                <button
                                    className="icon-btn edit"
                                    onClick={() => onEdit(product)}
                                    title="Editar"
                                >
                                    <FiEdit2 />
                                </button>

                                <button
                                    className="icon-btn delete"
                                    onClick={() => onDelete(product)}
                                    title="Eliminar"
                                >
                                    <FiTrash2 />
                                </button>
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default ProductTable;