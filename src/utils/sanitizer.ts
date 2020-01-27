export const alphanumeric = (name: string, separator = ''): string => {
  if (name.length === 0) throw new Error('No name was provided')
  return name.replace(/[\W_]+/g, separator)
}

export default {
  alphanumeric,
}
