export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  if (password.length < 6) errors.push("Password must be at least 6 characters")
  if (!/[A-Z]/.test(password)) errors.push("Password must contain an uppercase letter")
  if (!/[0-9]/.test(password)) errors.push("Password must contain a number")
  return { valid: errors.length === 0, errors }
}
