import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { narrarTexto } from '../lib/services/elevenlabs'
import './historias.css'

import stormBg from '../assets/momentos-storm-bg.png'
import imgStormlight from '../assets/story_storm.jpg'
import imgGodfather from '../assets/story_padrino.jpg'
import imgZelda from '../assets/story_zelda.jpg'
import imgMistborn from '../assets/story_mistborn.jpg'
import imgFrankenstein from '../assets/story_frankstein.jpg'

/* ── Story Data ── */
const STORIES = [
    {
        id: 'stormlight',
        category: 'Alta Fantasía Épica',
        badge: 'Cosmere',
        badgeIcon: 'bolt',
        title: 'El Archivo de las Tormentas — El Ritmo de la Guerra',
        author: 'Brandon Sanderson',
        image: imgStormlight,
        fragment:
            'La vida antes de la muerte. La fuerza antes de la debilidad. El viaje antes del destino. Kaladin alzó la lanza mientras la tormenta rugía a su alrededor, y en ese instante comprendió que la verdadera batalla no se libraba contra el enemigo, sino contra la oscuridad que habitaba en su propia mente.',
        cite: 'El Ritmo de la Guerra, Capítulo 110',
    },
    {
        id: 'godfather',
        category: 'Drama Criminal',
        badge: 'Clásico',
        badgeIcon: 'local_florist',
        title: 'El Padrino',
        author: 'Mario Puzo',
        image: imgGodfather,
        fragment:
            'Le haré una oferta que no podrá rechazar. Detrás de cada gran fortuna hay un crimen, y detrás de cada familia poderosa hay un hombre dispuesto a hacer lo que nadie más se atreve. La amistad lo es todo. La amistad es más que talento, más que el gobierno, más que casi igual a la familia.',
        cite: 'El Padrino, Libro I',
    },
    {
        id: 'zelda',
        category: 'Aventura Legendaria',
        badge: 'Videojuego',
        badgeIcon: 'shield',
        title: 'The Legend of Zelda',
        author: 'Shigeru Miyamoto / Nintendo',
        image: imgZelda,
        fragment:
            'Es peligroso ir solo. Toma esto. Con esas palabras, un anciano en una cueva cambió el destino de Hyrule para siempre. El héroe elegido por la diosa avanzó a través de bosques encantados y templos olvidados, portando la Espada Maestra contra la oscuridad de Ganondorf, guiado solo por el coraje que latía en su corazón.',
        cite: 'The Legend of Zelda — Tradición oral de Hyrule',
    },
    {
        id: 'mistborn',
        category: 'Fantasía Oscura',
        badge: 'Cosmere',
        badgeIcon: 'ac_unit',
        title: 'Nacidos de la Bruma — El Imperio Final',
        author: 'Brandon Sanderson',
        image: imgMistborn,
        fragment:
            'La ceniza caía del cielo. Siempre había caído y siempre caería. Vin levantó la mirada hacia el cielo rojo, sintiendo el estaño arder en su estómago mientras empujaba el metal a su alrededor. En un mundo donde la ceniza era eterna y el sol era rojo, una ladrona callejera descubriría que tenía el poder de derribar un imperio inmortal.',
        cite: 'Nacidos de la Bruma: El Imperio Final, Prólogo',
    },
    {
        id: 'frankenstein',
        category: 'Terror Gótico',
        badge: 'Clásico',
        badgeIcon: 'electric_bolt',
        title: 'Frankenstein — El Moderno Prometeo',
        author: 'Mary Shelley',
        image: imgFrankenstein,
        fragment:
            '¡Maldito creador! ¿Por qué formaste un monstruo tan horripilante que incluso tú te apartaste de mí con repugnancia? La lluvia golpeaba los cristales del laboratorio mientras la criatura abría sus ojos amarillentos por primera vez. En ese instante, Victor Frankenstein comprendió que había traspasado un límite que ningún mortal debería cruzar.',
        cite: 'Frankenstein, Capítulo V',
    },
]

export default function Historias() {
    const sectionsRef = useRef<(HTMLElement | null)[]>([])
    const [generatingId, setGeneratingId] = useState<string | null>(null)

    async function handlePlayAudio(fragment: string, id: string) {
        if (generatingId) return
        setGeneratingId(id)
        try {
            await narrarTexto(fragment)
        } catch (error) {
            console.error(error)
        } finally {
            setGeneratingId(null)
        }
    }

    /* Intersection Observer for scroll animations */
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('historia-visible')
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.15 }
        )

        sectionsRef.current.forEach((el) => {
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [])

    return (
        <div className="historias-page">
            <Header />

            {/* ── Hero ── */}
            <section className="historias-hero">
                <div
                    className="historias-hero-bg"
                    style={{ backgroundImage: `url(${stormBg})` }}
                />
                <div className="historias-hero-overlay" />
                <div className="historias-hero-content">
                    <span className="historias-hero-label">Fragmentos Inmortales</span>
                    <h1>HISTORIAS QUE TRASCIENDEN</h1>
                    <p className="historias-hero-desc">
                        Cada gran historia deja una huella imborrable. Aquí reunimos los fragmentos más
                        poderosos de universos que cambiaron para siempre la forma en que vemos el mundo.
                    </p>
                </div>
            </section>

            {/* ── Story Sections ── */}
            <div className="historias-grid">
                {STORIES.map((story, i) => (
                    <section
                        key={story.id}
                        className="historia-section"
                        ref={(el) => { sectionsRef.current[i] = el }}
                        style={{ animationDelay: `${i * 0.12}s` }}
                    >
                        {/* Image */}
                        <div className="historia-image-wrap">
                            <img
                                className="historia-image"
                                src={story.image}
                                alt={story.title}
                                loading="lazy"
                            />
                            <div className="historia-image-badge">
                                <span className="material-symbols-outlined">{story.badgeIcon}</span>
                                {story.badge}
                            </div>
                        </div>

                        {/* Text */}
                        <div className="historia-text">
                            <span className="historia-category">{story.category}</span>
                            <h2 className="historia-title">{story.title}</h2>
                            <p className="historia-author">
                                por <strong>{story.author}</strong>
                            </p>

                            <blockquote className="historia-fragment">
                                <p>{story.fragment}</p>
                                <cite>— {story.cite}</cite>
                            </blockquote>

                            <div className="historia-actions">
                                <Link to={`/mundos#${story.id}`} className="historia-btn">
                                    Explorar historia
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </Link>
                                <button 
                                    className="historia-btn-audio"
                                    onClick={() => handlePlayAudio(story.fragment, story.id)}
                                    disabled={generatingId !== null}
                                >
                                    {generatingId === story.id ? (
                                        <>
                                            <span className="material-symbols-outlined rotating">progress_activity</span>
                                            CARGANDO...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">volume_up</span>
                                            OÍR
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </section>
                ))}
            </div>
            <Footer />
        </div>
    )
}
