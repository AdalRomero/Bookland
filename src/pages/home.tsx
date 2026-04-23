import { Link } from 'react-router-dom'
import './home.css'
import heroBg from '../assets/hero-bg.png'
import cosmicRealm from '../assets/cosmic-realm.png'
import glowingCodex from '../assets/glowing-codex.png'
import footerBg from '../assets/footer-bg.png'

const FEATURES = [
    { icon: 'history_edu', title: 'Leyendas antiguas', desc: 'Cuentos susurrados a lo largo de milenios, preservados en el tejido mismo de la realidad.' },
    { icon: 'menu_book', title: 'Historias atemporales', desc: 'Historias que trascienden mundos, portadoras de verdades veladas en metáforas.' },
    { icon: 'public', title: 'Nuevos Mundos', desc: 'Explora paisajes alienígenas y reinos olvidados nacidos de Investidura.' },
    { icon: 'auto_awesome', title: 'Saber Cósmico', desc: 'Descubre la magia profunda y las conexiones ocultas que unen al universo.' },
    { icon: 'visibility', title: "Perspectiva del Testigo", desc: 'Observa la historia desarrollarse a través de los ojos del que siempre estuvo allí.' },
    { icon: 'music_note', title: 'Tradiciones Orales', desc: 'Experimenta el ritmo de mitos transmitidos a través del canto y el aliento.' },
]

const NAV_LINKS = ['HISTORIAS', 'MOMENTOS', 'LIBROS', 'PERSONAJES', 'MUNDOS']
const FOOTER_LINKS = ['HISTORIAS', 'MOMENTOS', 'LIBROS', 'PERSONAJES', 'MUNDOS', 'PRIVACIDAD', 'TERMINOS']

export default function Home() {
    return (
        <div className="hc-page">
            {/* ── TopNavBar ── */}
            <header className="hc-header">
                <div className="hc-header-inner">
                    <div className="hc-logo">CRONICAS DE UN SALTA MUNDOS</div>
                    <nav className="hc-nav">
                        {NAV_LINKS.map((link) => (
                            <Link 
                                key={link} 
                                to={link === 'LIBROS' ? '/libros' : '#'} 
                                className={link === 'LIBROS' ? 'active' : ''}
                            >
                                {link}
                            </Link>
                        ))}
                    </nav>
                    <Link to="/registro" className="hc-header-btn">Únete ahora</Link>
                </div>
            </header>

            <main className="hc-main">
                {/* ── Hero Section ── */}
                <section className="hc-hero">
                    <div
                        className="hc-hero-bg"
                        style={{ backgroundImage: `url(${heroBg})` }}
                    />
                    <div className="hc-hero-gradient" />

                    <div className="hc-hero-content">
                        <span className="hc-hero-label">Mas alla de lo conocido</span>
                        <h1>EXPLORA EL COSMERE</h1>
                        <p className="hc-hero-desc">
                            Descubre las historias de un Salta Mundos. Desentraña los secretos del universo, un cuento a la vez.
                        </p>
                        <div className="hc-hero-buttons">
                            <button className="hc-btn-primary">OÍR</button>
                            <button className="hc-btn-outline">LEER</button>
                        </div>
                    </div>
                </section>

                {/* ── Feature Grid ── */}
                <section className="hc-features">
                    <div className="hc-features-grid">
                        {FEATURES.map((f) => (
                            <div className="hc-feature-card" key={f.title}>
                                <div className="hc-feature-icon">
                                    <span className="material-symbols-outlined">{f.icon}</span>
                                </div>
                                <h3 className="hc-feature-title">{f.title}</h3>
                                <p className="hc-feature-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Section 1: See the Worlds ── */}
                <section className="hc-section hc-mt-md">
                    <div className="hc-section-img-wrapper">
                        <div className="hc-section-img-overlay" />
                        <img
                            className="hc-section-img"
                            src={cosmicRealm}
                            alt="Cosmic Realm"
                        />
                    </div>
                    <div className="hc-section-text">
                        <h2>LOS MUNDOS SE MUESTRAN ANTE TI</h2>
                        <p>
                            Embárcate en un viaje visual y auditivo a través de llanuras destrozadas,
                            ciudades envueltas en niebla y selvas coloridas. El archivo espera
                            a aquellos dispuestos a escuchar el silencio entre las estrellas.
                        </p>
                        <button className="hc-btn-outline">EXPLORAR AHORA</button>
                    </div>
                </section>

                {/* ── Section 2: Access the Archive ── */}
                <section className="hc-section hc-mt-sm reverse-mobile">
                    <div className="hc-section-text">
                        <h2>ACCEDE AL ARCHIVO EN CUALQUIER LUGAR</h2>
                        <p>
                            Sumérgete en el conocimiento acumulado de un inmortal errante. Nuestro compendio digital organiza fragmentos de saber, canciones y registros históricos para tu búsqueda académica.
                        </p>
                        <button className="hc-btn-primary">DESCUBRIR</button>
                    </div>
                    <div className="hc-section-img-wrapper short">
                        <div className="hc-section-img-gradient" />
                        <img
                            className="hc-section-img lighten"
                            src={glowingCodex}
                            alt="Glowing Codex"
                        />
                    </div>
                </section>
            </main>

            {/* ── Footer ── */}
            <footer className="hc-footer">
                <div
                    className="hc-footer-inner"
                    style={{ backgroundImage: `url(${footerBg})` }}
                >
                    <div className="hc-footer-overlay" />
                    <div className="hc-footer-brand">
                        <div className="hc-footer-logo">Crónicas de un Saltamundos</div>
                        <p className="hc-footer-copy">
                            © Crónicas de un Saltamundos. TODOS LOS DERECHOS RESERVADOS.
                        </p>
                    </div>
                    <nav className="hc-footer-nav">
                        {FOOTER_LINKS.map((link) => (
                            <a key={link} href="#">
                                {link}
                            </a>
                        ))}
                    </nav>
                </div>
            </footer>
        </div>
    )
}
