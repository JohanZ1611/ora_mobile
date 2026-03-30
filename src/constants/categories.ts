export const EXPENSE_CATEGORIES = [
  { id: "comida", label: "Comida", icon: "🍽️" },
  { id: "transporte", label: "Transporte", icon: "🚌" },
  { id: "salud", label: "Salud", icon: "🏥" },
  { id: "ocio", label: "Ocio", icon: "🎮" },
  { id: "hogar", label: "Hogar", icon: "🏠" },
  { id: "ropa", label: "Ropa", icon: "👕" },
  { id: "servicios", label: "Servicios", icon: "💡" },
  { id: "mercado", label: "Mercado", icon: "🛒" },
  { id: "otro", label: "Otro", icon: "📦" },
] as const;

export const INCOME_CATEGORIES = [
  { id: "salario", label: "Salario", icon: "💼" },
  { id: "freelance", label: "Freelance", icon: "💻" },
  { id: "negocio", label: "Negocio", icon: "🏪" },
  { id: "inversion", label: "Inversión", icon: "📈" },
  { id: "regalo", label: "Regalo", icon: "🎁" },
  { id: "otro", label: "Otro", icon: "📦" },
] as const;

export const FREQUENCIES = [
  { id: "ONCE", label: "Única vez" },
  { id: "DAILY", label: "Diario" },
  { id: "WEEKLY", label: "Semanal" },
  { id: "MONTHLY", label: "Mensual" },
  { id: "YEARLY", label: "Anual" },
] as const;