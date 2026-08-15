import { calendarAvailability } from '../services/api';

// Ported tal cual from agecan-front/src/app/services/api.service.ts (horasDisponibles)
// and agendar.page.ts (minDate calculation), using the America/Bogota timezone.

export interface IHorasDisponibles {
  manana: string[];
  tarde: string[];
}

/** Current date in America/Bogota as YYYY-MM-DD, same algorithm as the original app. */
export function bogotaDateString(date: Date = new Date()): string {
  const a = date.toLocaleDateString('en-US', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const b = a.split('/');
  return `${b[2]}-${b[0]}-${b[1]}`;
}

export async function horasDisponibles(date: string, cityId: string, locationId: string): Promise<IHorasDisponibles> {
  const currentLocalDate = new Date();
  const currentLocalDateString = bogotaDateString(currentLocalDate);
  const currentTime = currentLocalDate.toLocaleTimeString('en-US', {
    hour12: false,
    timeZone: 'America/Bogota',
  });
  const currentHour = parseInt(currentTime.slice(0, 2));
  const currentMinute = parseInt(currentTime.slice(3, 5));

  const currentPos = currentHour * 2 + Math.floor(currentMinute / 30);

  const isCurrentDate = date === currentLocalDateString;

  const horas: IHorasDisponibles = { manana: [], tarde: [] };

  const r = await calendarAvailability(date, cityId, locationId);
  for (let i = 0; i < 48; i++) {
    if (r.availability[i] === 'A' && !(isCurrentDate && i < currentPos + 3)) {
      const hora = Math.floor(i / 2);
      const minutos = (i % 2) * 30;
      const horaStr = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
      if (i < 24) {
        horas.manana.push(horaStr);
      } else {
        horas.tarde.push(horaStr);
      }
    }
  }
  return horas;
}
