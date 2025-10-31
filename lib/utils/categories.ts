// Mapeo de categorías de base de datos a nombres legibles
export const CATEGORY_LABELS: Record<string, string> = {
  CERVEZA: 'Cerveza',
  TRAGO: 'Trago',
  SHOT: 'Shot',
  SIN_ALCOHOL: 'Sin alcohol',
  OTRO: 'Otro',
};

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category;
}
