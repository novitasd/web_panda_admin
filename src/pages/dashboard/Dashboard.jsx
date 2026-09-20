
import { useEffect, useState } from "react";

import {
    MdInventory2,
    MdCategory,
    MdLocalOffer,
    MdShoppingCart,
} from "react-icons/md";

import StatCard from "../../components/dashboard/StatCard";
import { getDashboard } from "../../services/dashboard.service";

import "./Dashboard.css";

function Dashboard() {
    const [stats, setStats] = useState({
        products: 0,
        brands: 0,
        categories: 0,
        orders: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDashboard() {
            try {
                const data = await getDashboard();

                setStats({
                    products: data.products ?? 0,
                    brands: data.brands ?? 0,
                    categories: data.categories ?? 0,
                    orders: data.orders ?? 0,
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    return (
        <div className="dashboard-page">

            {/* HEADER */}
            <header className="dashboard-header">
                <div>
                    <span className="dashboard-eyebrow">
                        TIOURBAN / ADMIN
                    </span>

                    <h1>Dashboard</h1>

                    <p>
                        Gestiona tu tienda desde un solo lugar.
                    </p>
                </div>
            </header>

            {/* ESTADÍSTICAS */}
            <section className="dashboard-section">

                <div className="section-heading">
                    <h2>Resumen general</h2>
                    <span>Datos de tu tienda</span>
                </div>

                {loading ? (
                    <div className="stats-grid">

                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                className="stat-skeleton"
                                key={index}
                            >
                                <div className="skeleton-line small" />
                                <div className="skeleton-line large" />
                            </div>
                        ))}

                    </div>
                ) : (
                    <div className="stats-grid">

                        <StatCard
                            title="Productos"
                            value={stats.products}
                            icon={<MdInventory2 />}
                        />

                        <StatCard
                            title="Marcas"
                            value={stats.brands}
                            icon={<MdLocalOffer />}
                        />

                        <StatCard
                            title="Categorías"
                            value={stats.categories}
                            icon={<MdCategory />}
                        />

                        <StatCard
                            title="Órdenes"
                            value={stats.orders}
                            icon={<MdShoppingCart />}
                        />

                    </div>
                )}

            </section>

        </div>
    );
}

export default Dashboard;