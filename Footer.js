export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-branding">
          <h4>brend la la la</h4>
          <p>Витрачайте всі гроші в нас.</p>
        </div>

        <div className="footer-logo">
          <div className="diamond">
            <span className="diamond-text">LOGO</span>
            <div className="shine"></div>
          </div>
        </div>

        <div className="social">
          <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
          <a href="#"><i className="fa-brands fa-twitter"></i></a>
          <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
          <a href="#"><i className="fa-brands fa-google"></i></a>
        </div>
      </div>

      <p className="copyright">© 2025 IoT © все працює</p>
    </footer>
  );
}
