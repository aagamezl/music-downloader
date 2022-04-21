const ytpl = require('ytpl')

const getPlaylist = async (id) => {
  const playlist = await ytpl(id)

  return playlist
}

module.exports = getPlaylist
