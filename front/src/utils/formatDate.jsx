export function timeAgo(date) {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now - then) / 1000);

  if (diffInSeconds < 60) return "hace unos segundos"; //menos de 1 minuto
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`; // 5 minutos
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`; // 3 horas
  return `hace ${Math.floor(diffInSeconds / 86400)} días`; // 2 días
}