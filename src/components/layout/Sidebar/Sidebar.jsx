import { NavLink } from "react-router-dom";

import {
    MdDashboard,
    MdInventory2,
    MdCategory,
    MdLocalOffer,
    MdShoppingCart,
    MdLogout,
    MdWarehouse,
} from "react-icons/md";

import { useAuth } from "../../../context/AuthContext";

import "./Sidebar.css";

function Sidebar() {
    const { logout } = useAuth();

    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                TNIS
            </div>

            <nav className="sidebar-menu">

                <NavLink to="/">
                    <MdDashboard />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/products">
                    <MdInventory2 />
                    <span>Productos</span>
                </NavLink>

                <NavLink to="/brands">
                    <MdLocalOffer />
                    <span>Marcas</span>
                </NavLink>

                <NavLink to="/categories">
                    <MdCategory />
                    <span>Categorías</span>
                </NavLink>

                <NavLink to="/orders">
                    <MdShoppingCart />
                    <span>Órdenes</span>
                </NavLink>
                <NavLink to="/inventory">
                <MdWarehouse />
                <span>Inventario</span>
                </NavLink>
 
            </nav>

            <button
                className="logout-button"
                onClick={logout}
            >
                <MdLogout />
                <span>Cerrar sesión</span>
            </button>

        </aside>
    );
}

export default Sidebar;