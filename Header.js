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
          <a href="#" className="nav-link active">Home</a>
          <a href="#" className="nav-link">Catalog</a>
          <a href="#" className="nav-link">Cart</a>
        </nav>
      </div>
    </header>
  );
}
