import { isTodo } from './content.js';

export function hasHours(hours) {
  return Object.values(hours?.days ?? {}).some((day) => {
    if (!day || day.closed !== false || !Array.isArray(day.intervals)) return false;
    return day.intervals.some((interval) => !isTodo(interval.open) && !isTodo(interval.close));
  });
}

export function parseTime(value) {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return hour * 60 + minute;
}

export function formatTime(value) {
  const minutes = parseTime(value);
  if (minutes === null) return value;
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return minute === 0 ? `${hour} Uhr` : `${hour}:${String(minute).padStart(2, '0')} Uhr`;
}

export function todayKey(date = new Date(), timeZone = 'Europe/Berlin') {
  const weekday = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'long' }).format(date);
  return weekday.toLowerCase();
}

export function minutesInZone(date = new Date(), timeZone = 'Europe/Berlin') {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0) % 24;
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0);
  return hour * 60 + minute;
}

export function getOpenState(hours, date = new Date()) {
  const timeZone = hours?.timezone || 'Europe/Berlin';
  const day = hours?.days?.[todayKey(date, timeZone)];

  if (!day || day.closed === null) {
    return { state: 'unknown' };
  }

  if (day.closed === true) {
    return { state: 'closed' };
  }

  if (!Array.isArray(day.intervals) || day.intervals.length === 0) {
    return { state: 'unknown' };
  }

  const now = minutesInZone(date, timeZone);
  const intervals = day.intervals
    .map((interval) => ({
      ...interval,
      openMinutes: parseTime(interval.open),
      closeMinutes: parseTime(interval.close),
    }))
    .filter((interval) => interval.openMinutes !== null && interval.closeMinutes !== null);

  if (intervals.length === 0) {
    return { state: 'unknown' };
  }

  const current = intervals.find((interval) => now >= interval.openMinutes && now < interval.closeMinutes);
  if (current) {
    return { state: 'open', closesAt: current.close };
  }

  const next = intervals.find((interval) => interval.openMinutes > now);
  return { state: 'closed', opensAt: next?.open };
}
