/**
 * main.jsx
 * Punto de entrada React para la página Glosario.
 * Monta <Glosario /> en el div#root del index.html.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import Glosario from './Glosario.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Glosario />
  </React.StrictMode>
);
