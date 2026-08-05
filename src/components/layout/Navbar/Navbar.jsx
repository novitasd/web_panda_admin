import { MdMenu } from "react-icons/md";
import "./Navbar.css";

function Navbar({ onMenuClick }) {
    return (
        <header className="navbar">

            <button
                className="menu-button"
                onClick={onMenuClick}
            >
                <MdMenu />
            </button>

            <h2>Dashboard</h2>

        </header>
    );
}

export default Navbar;