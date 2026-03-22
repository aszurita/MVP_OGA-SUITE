import '../styles/NewsCard.css';

export default function NewsCard({ titulo, descripcion, autor, imagen, tag }) {
  return (
    <article className="news-card">
      <div className="news-card__img-wrap">
        <img src={imagen} alt={titulo} className="news-card__img" loading="lazy" />
        {tag && <span className="news-card__tag">{tag}</span>}
      </div>
      <div className="news-card__body">
        <p className="news-card__autor">{autor}</p>
        <h3 className="news-card__titulo">{titulo}</h3>
        <p className="news-card__desc">{descripcion}</p>
        <button className="news-card__cta">VER MÁS</button>
      </div>
    </article>
  );
}
