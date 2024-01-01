export function toRegExpString(regexp: RegExp) {
  return `/${regexp.source}/${regexp.flags}`
}
