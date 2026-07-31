import { useEffect, useState } from "react";

import { getOrders,getOrderById } from "../../services/order.service";

import "./Orders.css";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleView = async (id) => {
    try {
        const order = await getOrderById(id);

        setSelectedOrder(order);
        setShowModal(true);

    } catch (error) {
        console.error(error);
    }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch = order.orderNumber
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesStatus =
            status === "ALL"
                ? true
                : order.status === status;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return <p>Cargando pedidos...</p>;
    }

  return (
    <div className="orders-page">

        <h1>Pedidos</h1>

        <div className="orders-toolbar">

            <input
                type="text"
                placeholder="Buscar pedido..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="ALL">Todos</option>
                <option value="PENDING">Pendientes</option>
                <option value="PAID">Pagados</option>
                <option value="CANCELLED">Cancelados</option>
            </select>

        </div>

        <table className="orders-table">

            <thead>
                <tr>
                    <th>N° Pedido</th>
                    <th>Estado</th>
                    <th>Total</th>
                    <th>Productos</th>
                    <th>Fecha</th>
                    <th>Acción</th>
                </tr>
            </thead>

            <tbody>

                {filteredOrders.map((order) => (

                    <tr key={order.id}>

                        <td>{order.orderNumber}</td>

                        <td>
                            <span className={`status ${order.status.toLowerCase()}`}>
                                {order.status === "PENDING" && "Pendiente"}
                                {order.status === "PAID" && "Pagado"}
                                {order.status === "CANCELLED" && "Cancelado"}
                            </span>
                        </td>

                        <td>S/. {Number(order.total).toFixed(2)}</td>

                        <td>{order.items.length}</td>

                        <td>
                            {new Date(order.createdAt).toLocaleDateString()}
                        </td>

                        <td>
                            <button
                                className="view-btn"
                                onClick={() => handleView(order.id)}
                            >
                                Ver
                            </button>
                        </td>

                    </tr>

                ))}

            </tbody>

        </table>

        {showModal && selectedOrder && (

            <div
                className="modal-overlay"
                onClick={() => setShowModal(false)}
            >

                <div
                    className="order-modal"
                    onClick={(e) => e.stopPropagation()}
                >

                    <div className="order-modal-header">

                        <h2>{selectedOrder.orderNumber}</h2>

                        <button
                            className="close-modal"
                            onClick={() => setShowModal(false)}
                        >
                            ✕
                        </button>

                    </div>

                    <div className="order-info">

                        <p>
                            <strong>Estado:</strong>{" "}
                            {selectedOrder.status}
                        </p>

                        <p>
                            <strong>Total:</strong>{" "}
                            S/. {Number(selectedOrder.total).toFixed(2)}
                        </p>

                        <p>
                            <strong>Fecha:</strong>{" "}
                            {new Date(selectedOrder.createdAt).toLocaleString()}
                        </p>

                    </div>

                    <table className="order-items">

                        <thead>

                            <tr>
                                <th>Producto</th>
                                <th>Talla</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                            </tr>

                        </thead>

                        <tbody>

                            {selectedOrder.items.map((item) => (

                                <tr key={item.id}>

                                    <td>{item.product.name}</td>

                                    <td>{item.size.name}</td>

                                    <td>{item.quantity}</td>

                                    <td>
                                        S/. {Number(item.price).toFixed(2)}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        )}

    </div>
);
}

export default Orders;