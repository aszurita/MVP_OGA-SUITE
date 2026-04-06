import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './SharedComponents/Layout.jsx';
import Glosario from './Pages/Glosario/Glosario.jsx';
import PoliticasProcedimientos from './Pages/PoliticasProcedimientos/PoliticasProcedimientos.jsx';
import LibroDominios from './Pages/LibroDominios/LibroDominios.jsx';
import FichaDominio from './Pages/FichaDominio/FichaDominio.jsx';
import DominioTerminosAtributos from './Pages/DominioTerminosAtributos/DominioTerminosAtributos.jsx';
import DominioArtefactos from './Pages/DominioArtefactos/DominioArtefactos.jsx';
import DominioEstructura from './Pages/DominioEstructura/DominioEstructura.jsx';
import FichaTablas from './Pages/FichaTablas/FichaTablas.jsx';
import CasosDeUso from './Pages/CasosDeUso/CasosDeUso.jsx';
import ExploradorDeMetadatos from './Pages/ExploradorDeMetadatos/ExploradorMetadatos.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/glosario" replace />} />
          <Route path="/glosario" element={<Glosario />} />
          <Route path="/politicas-procedimientos" element={<PoliticasProcedimientos />} />
          <Route path="/libro-dominios" element={<LibroDominios />} />
          <Route path="/ficha-dominio/:id" element={<FichaDominio />} />
          <Route path="/dominio-terminos/:id/:tipo" element={<DominioTerminosAtributos />} />
          <Route path="/dominio-artefactos/:id" element={<DominioArtefactos />} />
          <Route path="/dominio-estructura/:id" element={<DominioEstructura />} />
          <Route path="/ficha-tablas/:id" element={<FichaTablas />} />
          <Route path="/casos-de-uso/:id" element={<CasosDeUso />} />
          <Route path="/explorador-metadatos" element={<ExploradorDeMetadatos />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
