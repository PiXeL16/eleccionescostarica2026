// ABOUTME: Category icon mapping for visual presentation
// ABOUTME: Maps category names to their corresponding Lucide React icons

import {
  BarChart3,
  BookOpen,
  Building2,
  Calculator,
  Cpu,
  Globe,
  HeartPulse,
  Landmark,
  Palette,
  Shield,
  TreePine,
  Users,
} from 'lucide-react';

/**
 * Get the appropriate icon component for a category
 */
export function getCategoryIcon(categoryName: string): React.ReactNode {
  const iconClass = 'h-5 w-5';

  const iconMap: Record<string, React.ReactNode> = {
    Economía: <BarChart3 className={iconClass} />,
    Impuestos: <Calculator className={iconClass} />,
    Salud: <HeartPulse className={iconClass} />,
    Educación: <BookOpen className={iconClass} />,
    Seguridad: <Shield className={iconClass} />,
    'Medio Ambiente': <TreePine className={iconClass} />,
    'Política Social': <Users className={iconClass} />,
    Infraestructura: <Building2 className={iconClass} />,
    'Política Exterior': <Globe className={iconClass} />,
    'Reforma Institucional': <Landmark className={iconClass} />,
    'Cultura y Deporte': <Palette className={iconClass} />,
    'Tecnología e Innovación': <Cpu className={iconClass} />,
    'Ambiente y Liderazgo Verde': <TreePine className={iconClass} />,
  };

  return iconMap[categoryName] || null;
}
