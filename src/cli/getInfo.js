const ytdl = require('ytdl-core')

const getInfo = async (videoId, basic = true) => {
  if (basic) {
    const info = await ytdl.getBasicInfo(videoId)

    return info
  }

  const info = await ytdl.getInfo(videoId)

  return info
}

module.exports = getInfo
