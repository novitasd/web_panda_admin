
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

  const menuItems = [
    {
      to: "/",
      label: "Dashboard",
      icon: <MdDashboard />,
    },
    {
      to: "/products",
      label: "Productos",
      icon: <MdInventory2 />,
    },
    {
      to: "/brands",
      label: "Marcas",
      icon: <MdLocalOffer />,
    },
    {
      to: "/categories",
      label: "Categorías",
      icon: <MdCategory />,
    },
    {
      to: "/orders",
      label: "Órdenes",
      icon: <MdShoppingCart />,
    },
    {
      to: "/inventory",
      label: "Inventario",
      icon: <MdWarehouse />,
    },
  ];

  return (
    <>
      {/* Overlay móvil */}
      <div
        className={`sidebar-overlay ${open ? "show" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${open ? "open" : ""}`}>

        {/* Cerrar en móvil */}
        <button
          className="sidebar-close"
          onClick={onClose}
          aria-label="Cerrar menú"
        >
          <MdClose />
        </button>

        {/* NAVEGACIÓN */}
        <nav className="sidebar-menu">

          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              title={item.label}
            >
              <span className="sidebar-icon">
                {item.icon}
              </span>

              <span className="sidebar-label">
                {item.label}
              </span>
            </NavLink>
          ))}

        </nav>

        {/* CERRAR SESIÓN */}
        <button
          className="logout-button"
          onClick={logout}
          title="Cerrar sesión"
        >
          <span className="sidebar-icon">
            <MdLogout />
          </span>

          <span className="sidebar-label">
            Cerrar sesión
          </span>
        </button>

      </aside>
    </>
  );
}

export default Sidebar;