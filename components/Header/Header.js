import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import { productsAPI } from "../../api/apiService"; 
import { selectCartItemsCount } from "../../redux/selectors";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

export default function Header() {
  const cartItemsCount = useSelector(selectCartItemsCount);
  const { user, logout, isAuthenticated } = useAuth();

  console.log('Header - cart items count:', cartItemsCount);

  const handleNavigation = async (page) => {
    try {
      console.log(` Navigation: Відправляю запит для ${page}`);
      await productsAPI.getProducts({ action: `navigate_${page.toLowerCase()}` });
    } catch (error) {
      console.error(`Помилка навігації ${page}:`, error);
    }
  };

  const handleLogout = async () => {
    try {
      await productsAPI.getProducts({ action: 'logout' });
      await logout();
    } catch (error) {
      console.error('Помилка виходу:', error);
    }
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <div className="diamond-logo">
          <div className="diamond">
            <span className="diamond-text">LOGO</span>
          </div>
        </div>

        <nav className="nav">
          {isAuthenticated() ? (
            <>
              <NavLink
                to="/"
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                onClick={() => handleNavigation('home')}
              >
                Home
              </NavLink>
              <NavLink
                to="/catalog"
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                onClick={() => handleNavigation('catalog')}
              >
                Catalog
              </NavLink>
              <NavLink
                to="/cart"
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                onClick={() => handleNavigation('cart')}
              >
                Cart {cartItemsCount > 0 && <span className="cart-count">({cartItemsCount})</span>}
              </NavLink>
              <div className="user-info">
                <span className="user-email">{user?.email || user?.username}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                onClick={() => handleNavigation('login')}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                onClick={() => handleNavigation('register')}
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}