import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdInventory2,
  MdCategory,
  MdLocalOffer,
  MdShoppingCart,
  MdLogout,
  MdWarehouse,
  MdClose,
} from "react-icons/md";

import { useAuth } from "../../../context/AuthContext";

import "./Sidebar.css";

function Sidebar({ open, onClose }) {
  const { logout } = useAuth();

  return (
    <>
      {/* Fondo oscuro */}
      <div
        className={`sidebar-overlay ${open ? "show" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <button
          className="sidebar-close"
          onClick={onClose}
        >
          <MdClose />
        </button>

        <div className="sidebar-logo">TNIS</div>

        <nav className="sidebar-menu">
          <NavLink to="/" onClick={onClose}>
            <MdDashboard />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/products" onClick={onClose}>
            <MdInventory2 />
            <span>Productos</span>
          </NavLink>

          <NavLink to="/brands" onClick={onClose}>
            <MdLocalOffer />
            <span>Marcas</span>
          </NavLink>

          <NavLink to="/categories" onClick={onClose}>
            <MdCategory />
            <span>Categorías</span>
          </NavLink>

          <NavLink to="/orders" onClick={onClose}>
            <MdShoppingCart />
            <span>Órdenes</span>
          </NavLink>

          <NavLink to="/inventory" onClick={onClose}>
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
    </>
  );
}

export default Sidebar;