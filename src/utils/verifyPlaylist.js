import { join } from 'node:path'

import ffmpegPath from 'ffmpeg-static'
import ffprobePath from 'ffprobe-static'
import ffmpeg from 'fluent-ffmpeg'

import { verifyDownloadSong } from './verifyDownloadSong.js'
import { createSongName } from './createSongName.js'
import { getPlaylistInfo } from './getPlaylistInfo.js'
import { sanitizeString, toTitleCase } from './index.js'

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath.path)

const TOLERANCE = 2

export const verifyPlaylist = async (dir, { playlist, artist, album, year, format }) => {
  // console.log('Verifying playlist...')
  // console.log('Dir:', dir)
  // console.log('Options:', { playlist, artist, album, year })

  const playlistInfo = await getPlaylistInfo({ playlist, artist, album, year })

  const invalidSongs = []
  let index = 1
  for (const song of playlistInfo) {
    // console.log('Song:', song)
    const albumDirectory = join(dir, sanitizeString(toTitleCase(artist)), `${year} - ${sanitizeString(toTitleCase(album))}`)
    const songName = createSongName(sanitizeString(toTitleCase(song.title)), index, format)
    const outputFile = join(albumDirectory, songName)

    const duration = await getDuration(outputFile)

    if (!verifyDownloadSong(song, duration, TOLERANCE)) {
      console.log(`Song ${song.id} is not valid`)
      console.log(`Expected duration: ${song.duration.seconds}, actual duration: ${duration}`)
      console.log('----------------------------------------')

      song.downloadedDuration = duration
      invalidSongs.push(song)
    }

    index++
  }

  return invalidSongs
}

export const getDuration = (input) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(input, (err, metadata) => {
      if (err) return reject(err)

      resolve(metadata.format.duration)
    })
  })
}
