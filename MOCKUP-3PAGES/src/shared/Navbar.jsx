import {
  FileText,
  Database,
  BookOpen,
  BookMarked,
  Headphones,
  BarChart2,
  Compass,
} from 'lucide-react';
import ElementNavbar from './ElementNavbar';
import './Navbar.css';

const NAV_ITEMS = [
  { icon: <FileText size={20} />, label: 'Políticas y Procedimientos', page: 'home' },
  { icon: <Database size={20} />, label: 'Data Hub', page: 'home' },
  { icon: <BookOpen size={20} />, label: 'Libro de Dominios', page: 'home' },
  { icon: <BookMarked size={20} />, label: 'Glosario Empresarial de Datos', page: 'glossary' },
  { icon: <Headphones size={20} />, label: 'Mesa de Ayuda de Datos', page: 'home' },
  { icon: <BarChart2 size={20} />, label: 'Indicadores de Gestión', page: 'home' },
  { icon: <Compass size={20} />, label: 'Estrategia del Dato', page: 'home' },
];

/**
 * Navbar compartida
 * Props: activePage (string), onNavigate (fn)
 */
export default function Navbar({ activePage, onNavigate }) {
  return (
    <nav className="navbar">
      {NAV_ITEMS.map((item) => (
        <ElementNavbar
          key={item.label}
          icon={item.icon}
          label={item.label}
          active={activePage === item.page && item.page !== 'home'}
          onClick={() => onNavigate(item.page)}
        />
      ))}
    </nav>
  );
}
