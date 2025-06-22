import ytsr from 'ytsr'

export const search = async (searchTerm, options = {}) => {
  const result = await ytsr(searchTerm)

  return result
}
