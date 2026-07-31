import { useEffect, useMemo, useState } from "react";

import { getStock } from "../../services/stock.service";
import { createInventoryMovement } from "../../services/inventoryMovement.service";

import { toast } from "react-toastify";

import "./Inventory.css";

function Inventory() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        loadInventory();
    }, []);

    /**
     * Cargar todo el inventario
     */
    async function loadInventory() {
        try {
            setLoading(true);

            const data = await getStock();

            setInventory(data);

        } catch (error) {
            console.error(
                "Error cargando inventario:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "No se pudo cargar el inventario."
            );

        } finally {
            setLoading(false);
        }
    }

    /**
     * Agregar una unidad al stock.
     *
     * Se registra como ENTRY porque representa
     * una entrada real de inventario.
     */
    async function increaseStock(item) {
        try {
            setUpdatingId(item.id);

            await createInventoryMovement({
                productSizeId: item.id,
                type: "ENTRY",
                quantity: 1,
                reason:
                    "Entrada manual desde panel de inventario",
            });

            setInventory((current) =>
                current.map((stockItem) =>
                    stockItem.id === item.id
                        ? {
                              ...stockItem,
                              stock:
                                  Number(stockItem.stock) + 1,
                          }
                        : stockItem
                )
            );

            toast.success(
                `Stock actualizado: ${item.product.name} - talla ${item.size.name}`
            );

        } catch (error) {
            console.error(
                "Error aumentando stock:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "No se pudo actualizar el stock."
            );

        } finally {
            setUpdatingId(null);
        }
    }

    /**
     * Restar una unidad manualmente.
     *
     * Usamos ADJUSTMENT porque esto NO representa
     * una venta. Las ventas posteriormente serán SALE.
     */
    async function decreaseStock(item) {
        const currentStock = Number(item.stock);

        if (currentStock <= 0) {
            return;
        }

        const newStock = currentStock - 1;

        try {
            setUpdatingId(item.id);

            await createInventoryMovement({
                productSizeId: item.id,
                type: "ADJUSTMENT",
                quantity: newStock,
                reason:
                    "Ajuste manual desde panel de inventario",
            });

            setInventory((current) =>
                current.map((stockItem) =>
                    stockItem.id === item.id
                        ? {
                              ...stockItem,
                              stock: newStock,
                          }
                        : stockItem
                )
            );

            toast.success(
                `Stock actualizado: ${item.product.name} - talla ${item.size.name}`
            );

        } catch (error) {
            console.error(
                "Error disminuyendo stock:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "No se pudo actualizar el stock."
            );

        } finally {
            setUpdatingId(null);
        }
    }

    /**
     * Inventario filtrado
     */
    const filteredInventory = useMemo(() => {
        const text = search
            .trim()
            .toLowerCase();

        return inventory.filter((item) => {
            const productName =
                item.product?.name
                    ?.toLowerCase() ?? "";

            const sku =
                item.product?.sku
                    ?.toLowerCase() ?? "";

            const size =
                item.size?.name
                    ?.toLowerCase() ?? "";

            const matchesSearch =
                !text ||
                productName.includes(text) ||
                sku.includes(text) ||
                size.includes(text);

            if (!matchesSearch) {
                return false;
            }

            const stock = Number(item.stock);

            if (filter === "available") {
                return stock > 0;
            }

            if (filter === "low") {
                return stock > 0 && stock <= 2;
            }

            if (filter === "out") {
                return stock === 0;
            }

            return true;
        });

    }, [inventory, search, filter]);

    /**
     * Estadísticas
     */
    const totalStock = inventory.reduce(
        (total, item) =>
            total + Number(item.stock),
        0
    );

    const lowStock = inventory.filter(
        (item) => {
            const stock = Number(item.stock);

            return stock > 0 && stock <= 2;
        }
    ).length;

    const outOfStock = inventory.filter(
        (item) =>
            Number(item.stock) === 0
    ).length;

    const productsWithStock = new Set(
        inventory
            .filter(
                (item) =>
                    Number(item.stock) > 0
            )
            .map(
                (item) =>
                    item.product?.id
            )
    ).size;

    if (loading) {
        return (
            <div className="inventory-page">
                <p>Cargando inventario...</p>
            </div>
        );
    }

    return (
        <div className="inventory-page">

            {/* ENCABEZADO */}

            <div className="inventory-header">

                <div>
                    <h1>Inventario</h1>

                    <p>
                        Controla el stock de tus
                        productos por talla.
                    </p>
                </div>

            </div>


            {/* ESTADÍSTICAS */}

            <div className="inventory-stats">

                <div className="inventory-stat-card">
                    <span>
                        Stock total
                    </span>

                    <strong>
                        {totalStock}
                    </strong>

                    <small>
                        Pares disponibles
                    </small>
                </div>


                <div className="inventory-stat-card">
                    <span>
                        Productos con stock
                    </span>

                    <strong>
                        {productsWithStock}
                    </strong>

                    <small>
                        Productos disponibles
                    </small>
                </div>


                <div className="inventory-stat-card">
                    <span>
                        Bajo stock
                    </span>

                    <strong>
                        {lowStock}
                    </strong>

                    <small>
                        Tallas con 1 o 2 pares
                    </small>
                </div>


                <div className="inventory-stat-card">
                    <span>
                        Agotados
                    </span>

                    <strong>
                        {outOfStock}
                    </strong>

                    <small>
                        Tallas sin stock
                    </small>
                </div>

            </div>


            {/* BUSCADOR Y FILTRO */}

            <div className="inventory-toolbar">

                <input
                    type="text"
                    placeholder="Buscar producto, SKU o talla..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <select
                    value={filter}
                    onChange={(e) =>
                        setFilter(e.target.value)
                    }
                >
                    <option value="all">
                        Todo el inventario
                    </option>

                    <option value="available">
                        Disponible
                    </option>

                    <option value="low">
                        Bajo stock
                    </option>

                    <option value="out">
                        Agotados
                    </option>
                </select>

            </div>


            {/* TABLA */}

            <div className="inventory-table-container">

                {filteredInventory.length === 0 ? (

                    <div className="inventory-empty">
                        No se encontraron registros
                        de inventario.
                    </div>

                ) : (

                    <table className="inventory-table">

                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>SKU</th>
                                <th>Talla</th>
                                <th>Estado</th>
                                <th>Stock</th>
                                <th>Modificar</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredInventory.map(
                                (item) => {

                                    const stock =
                                        Number(item.stock);

                                    const updating =
                                        updatingId ===
                                        item.id;

                                    return (
                                        <tr key={item.id}>

                                            {/* PRODUCTO */}

                                            <td>
                                                <div className="inventory-product">

                                                    <strong>
                                                        {item.product.name}
                                                    </strong>

                                                </div>
                                            </td>


                                            {/* SKU */}

                                            <td>
                                                <span className="inventory-sku">
                                                    {item.product.sku}
                                                </span>
                                            </td>


                                            {/* TALLA */}

                                            <td>
                                                <span className="inventory-size">
                                                    {item.size.name}
                                                </span>
                                            </td>


                                            {/* ESTADO */}

                                            <td>

                                                {stock === 0 ? (

                                                    <span className="stock-status stock-out">
                                                        Agotado
                                                    </span>

                                                ) : stock <= 2 ? (

                                                    <span className="stock-status stock-low">
                                                        Bajo stock
                                                    </span>

                                                ) : (

                                                    <span className="stock-status stock-available">
                                                        Disponible
                                                    </span>

                                                )}

                                            </td>


                                            {/* STOCK */}

                                            <td>
                                                <strong className="inventory-stock-number">
                                                    {stock}
                                                </strong>
                                            </td>


                                            {/* CONTROLES */}

                                            <td>

                                                <div className="inventory-stock-controls">

                                                    <button
                                                        type="button"
                                                        className="stock-control-button"
                                                        disabled={
                                                            stock <= 0 ||
                                                            updating
                                                        }
                                                        onClick={() =>
                                                            decreaseStock(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        −
                                                    </button>

                                                    <span>
                                                        {updating
                                                            ? "..."
                                                            : stock}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        className="stock-control-button"
                                                        disabled={
                                                            updating
                                                        }
                                                        onClick={() =>
                                                            increaseStock(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    );
                                }
                            )}

                        </tbody>

                    </table>

                )}

            </div>

        </div>
    );
}

export default Inventory;