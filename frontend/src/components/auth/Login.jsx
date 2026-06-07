// ============================================================
// ARCHIVO: src/components/auth/Login.jsx
// DESCRIPCIÓN: Componente de login y registro
// RUTAS CORRECTAS: ../../services/auth, ../../styles/Login.css
// ============================================================

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ✅ CORREGIDO: Subir 2 niveles para llegar a src/services/
import { login, register } from '../../services/auth'

// ✅ CORREGIDO: Subir 2 niveles para llegar a src/styles/
import '../../styles/Login.css'

const Login = () => {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [grup, setGrup] = useState('MME')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const switchTab = (t) => { setTab(t); setError(''); setSuccess('') }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const result = await login(email, password)
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.message)
      }
    } catch {
      setError('Error de connexió amb el servidor')
    }
    setLoading(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const result = await register(email, password, nombre, grup)
      if (result.success) {
        setSuccess('Registre completat! Ara pots iniciar sessió.')
        switchTab('login')
      } else {
        setError(result.message || 'Error en el registre')
      }
    } catch {
      setError('Error de connexió amb el servidor')
    }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🎛️</div>
          <h1>Servidor Recursos</h1>
          <p>Taller MME – V0.3</p>
        </div>

        <div className="login-tabs">
          <button className={`tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>
            🔐 Iniciar Sessió
          </button>
          <button className={`tab-btn ${tab === 'register' ? 'active' : ''}`} onClick={() => switchTab('register')}>
            📝 Registrar-se
          </button>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        {tab === 'login' && (
          <form onSubmit={handleLogin} className="login-form">
            <div className="field">
              <label>📧 Correu electrònic</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@escola.cat" required />
            </div>
            <div className="field">
              <label>🔑 Contrasenya</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••" required />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? '⏳ Verificant...' : '🚀 Entrar'}
            </button>
          </form>
        )}

        {tab === 'register' && (
          <form onSubmit={handleRegister} className="login-form">
            <div className="field">
              <label>📧 Correu electrònic</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@escola.cat" required />
            </div>
            <div className="field">
              <label>🔑 Contrasenya</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••" required minLength={6} />
            </div>
            <div className="field">
              <label>👤 Nom complet</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                placeholder="Nom Cognom" required />
            </div>
            <div className="field">
              <label>👥 Grup</label>
              <select value={grup} onChange={(e) => setGrup(e.target.value)}>
                <option value="MME">MME</option>
                <option value="SOX">SOX</option>
                <option value="BIP">BIP</option>
                <option value="Professors">Professors</option>
              </select>
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? '⏳ Registrant...' : '📝 Registrar-se'}
            </button>
          </form>
        )}

        <p className="login-hint" style={{ fontSize: '0.78rem' }}>
          Admin: <code>ADMIN_EMAIL</code> del <code>.env</code> · Contrasenya: <code>admin123</code>
        </p>
      </div>
    </div>
  )
}

export default Login