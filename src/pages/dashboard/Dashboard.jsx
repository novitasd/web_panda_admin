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
        <h1>Dashboard</h1>

        {loading ? (
            <p>Cargando estadísticas...</p>
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
    </div>
);
}

export default Dashboard;