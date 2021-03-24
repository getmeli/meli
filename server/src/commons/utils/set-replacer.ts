export function setReplacer(key, value) {
  return value instanceof Set ? Array.from(value) : value;
}
