import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const timeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { 
    addSuffix: true, 
    locale: es 
  });
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};