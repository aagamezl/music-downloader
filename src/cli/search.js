const ytsr = require('ytsr')

const search = async (searchTerm, options = {}) => {
  const result = await ytsr(searchTerm)

  return result
}

module.exports = search
