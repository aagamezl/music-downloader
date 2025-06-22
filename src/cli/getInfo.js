import ytdl from '@distube/ytdl-core'

export const getInfo = async (videoId, basic = true) => {
  if (basic) {
    const info = await ytdl.getBasicInfo(videoId)

    return info
  }

  const info = await ytdl.getInfo(videoId)

  return info
}
