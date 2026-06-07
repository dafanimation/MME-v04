// ============================================================
// ARCHIVO: src/main.jsx
// DESCRIPCIÓN: Punto de entrada de React
// FUNCIÓN: Renderiza la aplicación en el DOM
// ============================================================

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'        // ← Sin .jsx
import './index.css'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)