import { useState } from 'react';
import Navbar from './shared/Navbar';
import Header from './shared/Header';
import Home from './pages/home/Home';
import Glossary from './pages/glossary/Glossary';
import UseCases from './pages/useCases/UseCases';
import './App.css';

export default function App() {
  const [activePage, setActivePage] = useState('home');

  const renderPage = () => {
    switch (activePage) {
      case 'glossary':  return <Glossary />;
      case 'usecases':  return <UseCases />;
      default:          return <Home onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="app-shell">
      <Header activePage={activePage} onNavigate={setActivePage} />
      <div className="app-main">
        <Navbar activePage={activePage} onNavigate={setActivePage} />
        <div className="app-page">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
