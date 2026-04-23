import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { supabase } from '../lib/supabase/supabase'
import type { User } from '@supabase/supabase-js'
import './Header.css'
import { NAV_LINKS } from '../lib/constants'

export default function Header({ children }: { children?: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [menuOpen, setMenuOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [showFab, setShowFab] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setShowFab(window.scrollY > 300)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setMobileMenuOpen(false) // Close mobile menu on route change
    }, [location])

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const username = user?.user_metadata?.username as string | undefined

    async function handleLogout() {
        await supabase.auth.signOut()
        setUser(null)
        setMenuOpen(false)
    }

    return (
        <header className="hc-header">
            <div className="hc-header-inner">
                <Link to="/" className="hc-logo">CRONICAS DE UN SALTA MUNDOS</Link>
                <nav className="hc-nav">
                    {NAV_LINKS.map((link) => (
                        <Link 
                            key={link.name} 
                            to={link.path} 
                            className={location.pathname === link.path ? 'active' : ''}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="hc-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {children}
                    {user ? (
                        <div className="hc-user-menu">
                        <button
                            className="hc-user-btn"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <span className="hc-user-avatar">
                                {(username ?? user.email ?? '?')[0].toUpperCase()}
                            </span>
                            <span className="hc-user-name">
                                {username ?? user.email}
                            </span>
                            <span className="material-symbols-outlined hc-user-chevron">
                                {menuOpen ? 'expand_less' : 'expand_more'}
                            </span>
                        </button>
                        {menuOpen && (
                            <div className="hc-user-dropdown">
                                <div className="hc-dropdown-header">
                                    <span className="hc-dropdown-name">{username ?? 'Usuario'}</span>
                                    <span className="hc-dropdown-email">{user.email}</span>
                                </div>
                                <div className="hc-dropdown-divider" />
                                <button className="hc-dropdown-item" onClick={() => { setMenuOpen(false) }}>
                                    <span className="material-symbols-outlined">person</span>
                                    Mi perfil
                                </button>
                                <button className="hc-dropdown-item" onClick={() => { setMenuOpen(false) }}>
                                    <span className="material-symbols-outlined">settings</span>
                                    Configuración
                                </button>
                                <div className="hc-dropdown-divider" />
                                <button className="hc-dropdown-item hc-dropdown-logout" onClick={handleLogout}>
                                    <span className="material-symbols-outlined">logout</span>
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                    ) : (
                        <Link to="/registro" className="hc-header-btn">Únete ahora</Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu via Portal */}
            {mobileMenuOpen && createPortal(
                <div className="hc-mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
                    <div className="hc-mobile-menu" onClick={(e) => e.stopPropagation()}>
                        <div className="hc-mobile-menu-header">
                            <span className="hc-logo">CRONICAS</span>
                            <button className="hc-mobile-close" onClick={() => setMobileMenuOpen(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <nav className="hc-mobile-nav">
                            {NAV_LINKS.map((link) => (
                                <Link 
                                    key={link.name} 
                                    to={link.path} 
                                    className={location.pathname === link.path ? 'active' : ''}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <div className="nav-item-content">
                                        <span className="nav-name">{link.name}</span>
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </div>
                                </Link>
                            ))}
                            {!user && (
                                <Link to="/registro" className="hc-mobile-auth-btn" onClick={() => setMobileMenuOpen(false)}>
                                    REGISTRARSE
                                </Link>
                            )}
                            {user && (
                                <button className="hc-mobile-auth-btn logout" onClick={handleLogout}>
                                    CERRAR SESIÓN
                                </button>
                            )}
                        </nav>
                    </div>
                </div>,
                document.body
            )}

            {/* Floating Action Button (FAB) */}
            {createPortal(
                <div className={`hc-fab-container ${showFab ? 'visible' : ''} ${mobileMenuOpen ? 'menu-open' : ''}`}>
                    <button 
                        className="hc-fab-btn scroll-top" 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        aria-label="Subir"
                    >
                        <span className="material-symbols-outlined">north</span>
                    </button>
                    <button 
                        className="hc-fab-btn menu-toggle" 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Abrir menú"
                    >
                        <span className="material-symbols-outlined">
                            {mobileMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>,
                document.body
            )}
        </header>
    )
}
