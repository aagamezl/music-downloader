import ffmpegPath from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'

export const convert = (stream, downloadPath) => {
  const start = Date.now()

  return new Promise((resolve, reject) => {
    ffmpeg(stream)
      .setFfmpegPath(ffmpegPath)
      .audioBitrate(128)
      .save(downloadPath)
      .on('end', () => {
        process.stdout.write('\n')
        console.log(`Done, time elapsed - ${(Date.now() - start) / 1000}s`)
        resolve()
      })
      .on('error', (err) => {
        console.error('Error converting video:', err.message)
        reject(err)
      })
  })
}
