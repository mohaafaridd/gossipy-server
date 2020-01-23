export const stationNameSanitizer = (name: string): string => {
  if (name.length === 0) throw new Error('No station name was provided')
  return name.toLowerCase().replace(/[\W_]+/g, '')
}
