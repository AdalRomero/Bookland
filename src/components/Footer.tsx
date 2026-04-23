import { Link } from 'react-router-dom';
import { FOOTER_LINKS } from '../lib/constants';
import footerBg from '../assets/footer-bg.png';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="hc-footer">
      <div
        className="hc-footer-inner"
        style={{ backgroundImage: `url(${footerBg})` }}
      >
        <div className="hc-footer-overlay" />
        
        {/* Scroll to Top Button */}
        <button 
          className="hc-scroll-top-btn" 
          onClick={scrollToTop}
          aria-label="Volver arriba"
        >
          <div className="scroll-btn-circle">
            <span className="material-symbols-outlined">north</span>
          </div>
        </button>

        <div className="hc-footer-brand">
          <div className="hc-footer-logo">Crónicas de un Saltamundos</div>
          <p className="hc-footer-copy">
            © Crónicas de un Saltamundos. TODOS LOS DERECHOS RESERVADOS.
          </p>
        </div>
        
        <nav className="hc-footer-nav">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.name} to={link.path}>
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
