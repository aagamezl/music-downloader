export const createSongName = (title, index, format) => {
  return `${index.toString().padStart(2, '0')} - ${title}.${format}`
}
