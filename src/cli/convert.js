const ffmpegPath = require('ffmpeg-static')
const ffmpeg = require('fluent-ffmpeg')

const convert = (stream, downloadPath) => {
  const start = Date.now()

  ffmpeg(stream)
    .setFfmpegPath(ffmpegPath)
    .audioBitrate(128)
    .save(downloadPath)
    .on('end', () => {
      process.stdout.write('\n')

      console.log(`Done, time elapsed - ${(Date.now() - start) / 1000}s`)
    })
}

module.exports = convert
