export const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null
export const getUser = () => {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}
export const setAuth = (token, user) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}
export const clearAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
export const isAuthenticated = () => !!getToken()