import { FiEdit2, FiTrash2 } from "react-icons/fi";
import "./ProductTable.css";

function ProductTable({
    products,
    onEdit,
    onDelete,
}) {
    return (
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
                        <td>{product.name}</td>

                        <td>{product.brand?.name ?? "-"}</td>

                        <td>{product.category?.name ?? "-"}</td>

                        <td>S/ {product.price}</td>

                        <td>
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

                        <td className="actions">

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
    );
}

export default ProductTable;