export function isImageUrl(value: string) {
  return /^https?:\/\//i.test(value) || value.startsWith("data:image/");
}
