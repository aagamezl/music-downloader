const fs = require('fs')
const path = require('path')
const readline = require('readline')

const ytdl = require('ytdl-core')
const { titleCase } = require('@devnetic/utils')

const getInfo = require('./getInfo')
const getUrl = require('./getUrl')
const convert = require('./convert')

const downloadVideo = async (videoId, output = '') => {
  const info = await getInfo(videoId)

  const videoTitle = titleCase(info.videoDetails.title).replace(/\//g, '-')
  const downloadPath = path.resolve(path.join(output, `${videoTitle}.mp3`))

  fs.mkdirSync(output, { recursive: true })

  const stream = ytdl(getUrl(videoId), { quality: 'highestaudio' })
    .on('progress', (_, downloaded, total) => {
      readline.cursorTo(process.stdout, 0)

      process.stdout.write(`${(downloaded / total * 100).toFixed(2)}% processed`)
    })

  convert(stream, downloadPath)
}

module.exports = downloadVideo
