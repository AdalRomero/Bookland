import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type Book, searchGoogleBooks, getLocalBooks, saveBookToLocal } from '../lib/book_service.ts';
import footerBg from '../assets/footer-bg.png';
import './libros.css';

import Header from '../components/Header';
import { NAV_LINKS } from '../lib/constants';

export default function Libros() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [localBooks, setLocalBooks] = useState<Book[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    fetchLocalBooks();
    fetchFeaturedBooks();
  }, []);

  useEffect(() => {
    if (featuredBooks.length === 0 || isPaused) return;
    
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % featuredBooks.length);
    }, 90000); // 1:30 aproximado (90 segundos)

    return () => clearInterval(timer);
  }, [featuredBooks, isPaused]);

  const fetchFeaturedBooks = async () => {
    setFeaturedLoading(true);
    try {
      // Buscamos libros del Cosmere y otros libros populares para mezclar
      const [cosmereResults, popularResults] = await Promise.all([
        searchGoogleBooks('Cosmere Brandon Sanderson'),
        searchGoogleBooks('top fantasy sci-fi books 2024')
      ]);
      
      // Tomamos unos 7 del cosmere y el resto de populares
      const cosmereMix = cosmereResults.filter(b => b.cover_url).slice(0, 7);
      const popularMix = popularResults.filter(b => b.cover_url).slice(0, 13);
      
      // Mezclamos y aleatorizamos un poco
      const combined = [...cosmereMix, ...popularMix].sort(() => Math.random() - 0.5);
      setFeaturedBooks(combined);
    } catch (error) {
      console.error("Error fetching featured books", error);
    } finally {
      setFeaturedLoading(false);
    }
  };

  const fetchLocalBooks = async () => {
    const data = await getLocalBooks();
    setLocalBooks(data);
  };

  const handleBookClick = (i: number, book: Book) => {
    if (i === carouselIndex) {
      setSelectedBook(book);
    } else {
      setCarouselIndex(i);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 40; // Sensibilidad un poco más alta
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) {
      setCarouselIndex((prev) => (prev + 1) % featuredBooks.length);
    } else if (isRightSwipe) {
      setCarouselIndex((prev) => (prev - 1 + featuredBooks.length) % featuredBooks.length);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    const results = await searchGoogleBooks(searchQuery);
    setBooks(results);
    setLoading(false);
  };

  const handleSaveBook = async (book: Book) => {
    const success = await saveBookToLocal(book);
    if (success) {
      alert('Libro guardado en la colección local.');
      fetchLocalBooks();
    }
  };

  return (
    <div className="libros-page">
      <Header />

      <main className="libros-main">
        <section className="libros-hero">
          <div className="libros-hero-content">
            <h1>EL ARCHIVO DEL SALTAMUNDOS</h1>
            <p className="hc-hero-desc" style={{textAlign: 'center'}}>
              Busca en las páginas de tus cuentos favoritos. Los mundos lejanos dejan allí su magia escondida para que tú la encuentres.            
            </p>
            <form className="libros-search-form" onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <span className="material-symbols-outlined search-icon">search</span>
                <input 
                  type="text" 
                  placeholder="Busca por título, autor o ISBN..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'BUSCANDO...' : 'BUSCAR'}
                </button>
              </div>
            </form>
          </div>

          <div className="carousel-section">
            {featuredLoading ? (
              <div className="carousel-loader">CARGANDO EL ARCHIVO...</div>
            ) : featuredBooks.length > 0 && (
              <div 
                className="libros-carousel-container"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="carousel-perspective">
                  <div 
                    className="carousel-track" 
                    style={{ transform: `translateX(-${carouselIndex * 200}px)` }}
                  >
                    {featuredBooks.map((book, i) => (
                      <div 
                        key={i} 
                        className={`carousel-slide ${i === carouselIndex ? 'active' : ''} ${i < carouselIndex ? 'prev' : ''} ${i > carouselIndex ? 'next' : ''}`}
                        onClick={() => handleBookClick(i, book)}
                      >
                        <div className="floating-book-card">
                          <div className="floating-cover">
                            <img src={book.cover_url} alt={book.title} />
                            <div className="cover-shadow"></div>
                          </div>
                          <div className="floating-info">
                            <h3>{book.title}</h3>
                            <p>{book.author}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="carousel-dots">
                  {featuredBooks.map((_, i) => (
                    <button 
                      key={i} 
                      className={`dot ${i === carouselIndex ? 'active' : ''}`}
                      onClick={() => setCarouselIndex(i)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="libros-results">
          {books.length > 0 && (
            <div className="results-container">
              <h2 className="section-title">Resultados de Búsqueda</h2>
              <div className="books-grid">
                {books.map((book, i) => (
                  <div className="book-card" key={book.google_books_id || i} onClick={() => setSelectedBook(book)}>
                    <div className="book-cover-wrapper">
                      <img src={book.cover_url || 'https://via.placeholder.com/128x192?text=No+Cover'} alt={book.title} />
                      <div className="book-overlay">
                        <button className="view-details-btn">VER DETALLES</button>
                      </div>
                    </div>
                    <div className="book-info">
                      <h3>{book.title}</h3>
                      <p className="book-author">{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="results-container">
            <h2 className="section-title">Colección Destacada</h2>
            <div className="books-grid">
              {localBooks.length > 0 ? (
                localBooks.map((book) => (
                  <div className="book-card" key={book.id} onClick={() => setSelectedBook(book)}>
                    <div className="book-cover-wrapper">
                      <img src={book.cover_url} alt={book.title} />
                      <div className="book-overlay">
                        <button className="view-details-btn">VER DETALLES</button>
                      </div>
                    </div>
                    <div className="book-info">
                      <h3>{book.title}</h3>
                      <p className="book-author">{book.author}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-books">No hay libros en la colección local aún. ¡Busca uno y guárdalo!</p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ── Book Detail Modal ── */}
      {selectedBook && (
        <div className="book-modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="book-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedBook(null)}>
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <div className="modal-body">
              <div className="modal-cover">
                <img src={selectedBook.cover_url} alt={selectedBook.title} />
              </div>
              <div className="modal-info">
                <span className="modal-label">Detalles del Libro</span>
                <h2>{selectedBook.title}</h2>
                <p className="modal-author">por <span>{selectedBook.author}</span></p>
                
                <div className="modal-metadata">
                  {selectedBook.pages && <span><strong>Páginas:</strong> {selectedBook.pages}</span>}
                  {selectedBook.isbn && <span><strong>ISBN:</strong> {selectedBook.isbn}</span>}
                  {selectedBook.published_date && <span><strong>Publicado:</strong> {selectedBook.published_date}</span>}
                </div>

                <div className="modal-synopsis">
                  <h3>Sinopsis</h3>
                  <div dangerouslySetInnerHTML={{ __html: selectedBook.synopsis }} />
                </div>

                <div className="modal-actions">
                  {selectedBook.epub_url ? (
                    <a href={selectedBook.epub_url} className="hc-btn-primary download-btn" download>
                      DESCARGAR EPUB
                    </a>
                  ) : (
                    <button className="hc-btn-primary download-btn disabled" disabled>
                      EPUB NO DISPONIBLE
                    </button>
                  )}
                  {!selectedBook.id && (
                    <button className="hc-btn-outline save-btn" onClick={() => handleSaveBook(selectedBook)}>
                      GUARDAR EN COLECCIÓN
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
            {NAV_LINKS.map((link) => (
              <Link key={link.name} to={link.path}>{link.name}</Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
