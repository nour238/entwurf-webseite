export function isTodo(value) {
  return typeof value === 'string' && value.trim().toUpperCase().startsWith('TODO');
}

export function hasText(value) {
  return typeof value === 'string' && value.trim() !== '' && !isTodo(value);
}
