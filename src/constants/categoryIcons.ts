import {
  Utensils, Bus, Heart, Gamepad2, Home, Shirt,
  Zap, ShoppingCart, Package, Briefcase, Monitor,
  Store, TrendingUp, Gift, LucideIcon,
} from "lucide-react-native";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  // Gastos
  comida: Utensils,
  transporte: Bus,
  salud: Heart,
  ocio: Gamepad2,
  hogar: Home,
  ropa: Shirt,
  servicios: Zap,
  mercado: ShoppingCart,
  // Ingresos
  salario: Briefcase,
  freelance: Monitor,
  negocio: Store,
  inversion: TrendingUp,
  regalo: Gift,
  // Fallback
  otro: Package,
};

export function getCategoryIcon(category: string): LucideIcon {
  return CATEGORY_ICONS[category.toLowerCase()] ?? Package;
}