export const alphanumeric = (name: string): string => {
  if (name.length === 0) throw new Error('No name was provided')
  return name.replace(/[\W_]+/g, '')
}

export default {
  alphanumeric,
}
