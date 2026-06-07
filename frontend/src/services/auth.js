const TOKEN_KEY = 'mme_token'
const USER_KEY = 'mme_user'

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const getUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY)) }
  catch { return null }
}

export const isAuthenticated = () => !!getToken()

export const isAdmin = () => {
  const user = getUser()
  const role = String(user?.role || user?.rol || '').toLowerCase()
  return role === 'admin' || role === 'admin_master' || role === 'admin master'
}

export const login = async (email, password) => {
  // El backend NestJS espera 'code' no 'password'
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code: password }),  // 👈 CANVIAT: password -> code
  })
  const data = await res.json()
  if (res.ok && data.token) {
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    return { success: true, isAdmin: data.user?.role === 'admin' }
  }
  return { success: false, message: data.message || "Error d'autenticació" }
}

export const register = async (email, password, name, group) => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, group }),
  })
  const data = await res.json()
  return { success: res.ok, message: data.message }
}

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}