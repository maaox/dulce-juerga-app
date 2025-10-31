export function applyDiscount(
  precioBase: number,
  descuentoPorcentaje: number
): number {
  return precioBase * (1 - descuentoPorcentaje / 100);
}

export function calculateRemainingTime(horaFin: string): number {
  const now = new Date();
  const [hours, minutes] = horaFin.split(':').map(Number);
  const finTime = new Date(now);
  finTime.setHours(hours, minutes, 0, 0);

  const diff = finTime.getTime() - now.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60))); // minutos
}

export function formatPrice(price: number): string {
  return `S/${price.toFixed(2)}`;
}

export function formatTimeRemaining(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
  return `${minutes}m`;
}
