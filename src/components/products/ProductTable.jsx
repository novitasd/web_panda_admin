
import { useRef, useState } from "react";
import { FiEdit2, FiTrash2, FiChevronRight } from "react-icons/fi";

import "./ProductTable.css";

function ProductTable({
    products = [],
    onEdit,
    onDelete,
}) {
    const [openId, setOpenId] = useState(null);
    const startX = useRef(0);

    const handleTouchStart = (event) => {
        startX.current = event.touches[0].clientX;
    };

    const handleTouchEnd = (event, productId) => {
        const endX = event.changedTouches[0].clientX;
        const distance = startX.current - endX;

        if (distance > 50) {
            setOpenId(productId);
        }

        if (distance < -50) {
            setOpenId(null);
        }
    };

    return (
        <div className="product-table-wrapper">

            {/* =========================
                ESCRITORIO
            ========================= */}

            <table className="product-table desktop-table">

                <thead>
                    <tr>
                        <th>Producto</th>
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

                            <td>
                                <div className="product-name">
                                    {product.name}
                                </div>
                            </td>

                            <td>
                                {product.brand?.name ?? "-"}
                            </td>

                            <td>
                                {product.category?.name ?? "-"}
                            </td>

                            <td>
                                S/ {Number(product.price).toFixed(2)}
                            </td>

                            <td>
                                <span
                                    className={`status ${
                                        product.active
                                            ? "active"
                                            : "inactive"
                                    }`}
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

            {/* =========================
                MOVIL - ESTILO WHATSAPP
            ========================= */}

            <div className="mobile-product-list">

                {products.map((product) => {

                    const isOpen = openId === product.id;

                    return (

                        <div
                            className={`swipe-item ${
                                isOpen ? "is-open" : ""
                            }`}
                            key={product.id}
                        >

                            {/* Acciones ocultas */}

                            <div className="swipe-actions">

                                <button
                                    className="swipe-edit"
                                    onClick={() => {
                                        onEdit(product);
                                        setOpenId(null);
                                    }}
                                    aria-label="Editar producto"
                                >
                                    <FiEdit2 />
                                    <span>Editar</span>
                                </button>

                                <button
                                    className="swipe-delete"
                                    onClick={() => {
                                        onDelete(product);
                                        setOpenId(null);
                                    }}
                                    aria-label="Eliminar producto"
                                >
                                    <FiTrash2 />
                                    <span>Eliminar</span>
                                </button>

                            </div>

                            {/* Elemento deslizable */}

                            <div
                                className="swipe-content"
                                onTouchStart={handleTouchStart}
                                onTouchEnd={(event) =>
                                    handleTouchEnd(event, product.id)
                                }
                                onClick={() => {
                                    if (isOpen) {
                                        setOpenId(null);
                                    }
                                }}
                            >

                                <div className="mobile-product-icon">
                                    <span>
                                        {product.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>

                                <div className="mobile-product-info">

                                    <strong>
                                        {product.name}
                                    </strong>

                                    <span>
                                        {product.brand?.name ?? "Sin marca"}
                                    </span>

                                </div>

                                <div className="mobile-product-price">
                                    S/ {Number(product.price).toFixed(2)}
                                </div>

                                <FiChevronRight className="mobile-arrow" />

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>
    );
}

export default ProductTable;