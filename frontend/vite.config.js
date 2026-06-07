/* eslint-disable */
// @ts-nocheck
// ============================================================
// ARCHIVO: frontend/vite.config.js
// DESCRIPCIÓN: Configuración de Vite para el frontend
// VERSIÓN: 1.0
// FECHA: 2026-06-05
// ============================================================
// FUNCIONES:
// 1. Plugin React para JSX
// 2. Servidor en puerto 5173
// 3. Proxy /api → backend NestJS (puerto 3000)
// 4. Resolución de extensiones de archivo
// ============================================================
// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})