import { styleText } from 'node:util'

import ffmpegPath from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'

export const convert = (stream, format, downloadPath) => {
  const start = Date.now()

  return new Promise((resolve, reject) => {
    const converter = ffmpeg(stream)

    if (format === 'mp3') {
      converter.audioBitrate(128)
    }

    if (format === 'flac') {
      converter.audioCodec('flac')
        .format('flac')
    }

    converter.setFfmpegPath(ffmpegPath)
      .save(downloadPath)
      .on('end', () => {
        process.stdout.write('\n')

        console.log(styleText('green', `Convertion completed, time elapsed - ${(Date.now() - start) / 1000}s`))

        resolve()
      })
      .on('error', (err) => {
        console.error(styleText('red', 'Error converting video:'), err.message)
        reject(err)
      })
  })
}
