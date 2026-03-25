/**
 * App.jsx
 * Router principal de la aplicación OGA Suite.
 * Usa path-based routing (/ruta) leyendo window.location.pathname.
 * Vite sirve index.html para todas las rutas en dev, por lo que
 * cada navegación recarga la página y React lee el pathname correcto.
 *
 * Cómo agregar una nueva página:
 *   1. Importa el componente
 *   2. Agrégalo al objeto ROUTES con su path  →  '/mi-pagina': MiPagina
 *   3. Pon el link en index.html con          →  href="/mi-pagina"
 */
import Glosario from './Pages/Glosario/Glosario.jsx';
import PoliticasProcedimientos from './Pages/PoliticasProcedimientos/PoliticasProcedimientos.jsx';

const ROUTES = {
  '/politicas-procedimientos': PoliticasProcedimientos,
  '/glosario': Glosario,
};

export default function App() {
  const Page = ROUTES[window.location.pathname] || Glosario;
  return <Page />;
}
