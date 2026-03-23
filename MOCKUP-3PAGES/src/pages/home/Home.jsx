import { useState } from 'react';
import { ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';
import NewsCard from './components/NewsCard';
import { newsItems, bannerSlides } from '../../data/newsData';
import './styles/Home.css';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsOpen, setNewsOpen] = useState(false);


  const goSlide = (dir) => {
    setCurrentSlide((prev) => (prev + dir + bannerSlides.length) % bannerSlides.length);
  };

  return (
    <div className="home">

      {/* Banner ocupa todo */}
      <div className="home__banner">
        <div className="home__banner-slide">
          <button className="home__banner-arrow" onClick={() => goSlide(-1)}>
            <ChevronLeft size={18} />
          </button>

          <div className="home__banner-card">
            <div className="home__banner-logo">
              <img src="/images/Logo_OGASUITE.png" alt="OGA Suite" className="home__banner-logo-img" />
            </div>
            <h1 className="home__banner-title">{bannerSlides[currentSlide].titulo}</h1>
            <p className="home__banner-sub">{bannerSlides[currentSlide].subtitulo}</p>
            <p className="home__banner-desc">{bannerSlides[currentSlide].descripcion}</p>
          </div>

          <button className="home__banner-arrow" onClick={() => goSlide(1)}>
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="home__banner-dots">
          {bannerSlides.map((_, i) => (
            <button
              key={i}
              className={`home__banner-dot${i === currentSlide ? ' home__banner-dot--active' : ''}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>

        <div className="home__banner-footer">Banco Guayaquil 2023</div>
      </div>

      {/* Botón noticias — esquina superior derecha, solo cuando está cerrado */}
      {!newsOpen && (
        <button
          className="home__news-btn"
          onClick={() => setNewsOpen(true)}
          title="Ver noticias"
        >
          <Newspaper size={16} />
        </button>
      )}

      {/* Panel noticias — overlay */}
      {newsOpen && (
        <aside className="home__news">
          <div className="home__news-header">
            <span className="home__news-title">Noticias</span>
            <button className="home__news-close" onClick={() => setNewsOpen(false)}>
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="home__news-list">
            {newsItems.map((n) => (
              <NewsCard key={n.id} {...n} />
            ))}
          </div>
        </aside>
      )}

    </div>
  );
}
