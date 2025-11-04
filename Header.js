import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="diamond-logo">
          <div className="diamond">
            <span className="diamond-text">LOGO</span>
          </div>
        </div>

        <nav className="nav">
          <NavLink
            to="/"
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/catalog"
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            Catalog
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            Cart
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
