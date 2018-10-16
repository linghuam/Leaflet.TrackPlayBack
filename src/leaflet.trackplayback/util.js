export function isArray (arr) {
  return Array.isArray ? Array.isArray(arr) : Object.prototype.toString.call(arr) === '[object Array]'
}
