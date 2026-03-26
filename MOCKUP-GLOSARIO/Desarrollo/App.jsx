import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './SharedComponents/Layout.jsx';
import Glosario from './Pages/Glosario/Glosario.jsx';
import PoliticasProcedimientos from './Pages/PoliticasProcedimientos/PoliticasProcedimientos.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/glosario" replace />} />
          <Route path="/glosario" element={<Glosario />} />
          <Route path="/politicas-procedimientos" element={<PoliticasProcedimientos />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
