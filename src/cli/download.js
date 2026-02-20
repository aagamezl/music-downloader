import fs from 'fs'
import path from 'path'
import readline from 'readline'

import ytdl from '@distube/ytdl-core'
import { titleCase } from '@devnetic/utils'

import { getInfo } from './getInfo.js'
import { convert } from './convert.js'

export const downloadVideo = async (videoId, output = '') => {
  try {
    const info = await getInfo(videoId)
    const videoTitle = titleCase(info.videoDetails.title).replace(/\//g, '-')
    // const downloadPath = path.resolve(path.join(output, `${videoTitle}.mp3`))
    const downloadPath = path.resolve(path.join(output, `${videoId}.mp3`))

    fs.mkdirSync(output, { recursive: true })

    const stream = ytdl(videoId, { quality: 'highestaudio' })
      .on('progress', (_, downloaded, total) => {
        readline.cursorTo(process.stdout, 0)
        process.stdout.write(`${(downloaded / total * 100).toFixed(2)}% processed`)
      })
      .on('error', (err) => {
        console.error('Error downloading video:', err.message)
        throw err
      })

    await convert(stream, 'mp3', downloadPath)
  } catch (err) {
    console.error('Error:', err.message)
    throw err
  }
}
