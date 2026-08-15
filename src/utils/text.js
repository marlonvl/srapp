export function toTitleCase(value) {
  return value.toLowerCase().replace(/(?:^|\s)\S/g, (letter) => letter.toUpperCase())
}
