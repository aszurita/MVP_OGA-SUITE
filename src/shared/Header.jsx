import { Bell, Star, BarChart2, Info, Grid, Power, Menu } from 'lucide-react';
import './Header.css';

/**
 * Header compartido
 * Props: onNavigate (fn), activePage
 */
export default function Header({ onNavigate, activePage }) {
  return (
    <header className="header">
      <button className="header__menu-btn" onClick={() => onNavigate('home')}>
        <Menu size={18} />
      </button>

      <img
        src="/images/Logo_OGASUITE_Header.png"
        alt="OGA Suite"
        className="header__center-logo"
        onClick={() => onNavigate('home')}
      />

      <nav className="header__page-nav">
        <button
          className={`header__nav-btn${activePage === 'home' ? ' header__nav-btn--active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          Home
        </button>
        <button
          className={`header__nav-btn${activePage === 'glossary' ? ' header__nav-btn--active' : ''}`}
          onClick={() => onNavigate('glossary')}
        >
          Glosario
        </button>
        <button
          className={`header__nav-btn${activePage === 'usecases' ? ' header__nav-btn--active' : ''}`}
          onClick={() => onNavigate('usecases')}
        >
          Casos de Uso
        </button>
      </nav>

      <div className="header__right">
        <span className="header__username">Primero Angelo</span>
        <button className="header__icon-btn"><Bell size={17} /></button>
        <button className="header__icon-btn"><Star size={17} /></button>
        <button className="header__icon-btn"><BarChart2 size={17} /></button>
        <button className="header__icon-btn"><Info size={17} /></button>
        <button className="header__icon-btn"><Grid size={17} /></button>
        <button className="header__icon-btn"><Power size={17} /></button>
      </div>
    </header>
  );
}
