import "./Navbar.css";
import pandaLogo from "../../../assets/pandanegra.png";

function Navbar() {
    return (
        <header className="navbar">
            <img
                src={pandaLogo}
                alt="Panda"
                className="navbar-logo"
            />
        </header>
    );
}

export default Navbar;