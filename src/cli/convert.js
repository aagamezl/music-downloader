import ffmpegPath from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'

export const convert = ({ stream, format, targetLoudness, downloadPath }) => {
  const start = Date.now()

  return new Promise((resolve, reject) => {
    const converter = ffmpeg(stream)
      .audioFilters([
        `loudnorm=I=${targetLoudness}:LRA=7:tp=-2`
      ])

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

        console.log(`Convertion completed, time elapsed - ${(Date.now() - start) / 1000}s`)

        resolve()
      })
      .on('error', (err) => {
        console.error('Error converting video:', err.message)
        reject(err)
      })
  })
}
