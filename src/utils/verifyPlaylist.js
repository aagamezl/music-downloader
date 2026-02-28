import { join } from 'node:path'
import { styleText } from 'node:util'

import ffmpegPath from 'ffmpeg-static'
import ffprobePath from 'ffprobe-static'
import ffmpeg from 'fluent-ffmpeg'

import { verifyDownloadSong } from './verifyDownloadSong.js'
import { createSongName } from './createSongName.js'
import { getPlaylistInfo } from './getPlaylistInfo.js'
import { sanitizeString, toTitleCase } from './index.js'
import { DEFAULT_OUTPUT_DIRECTORY } from '../../download-playlist.js'

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath.path)

const TOLERANCE = 2

export const verifyPlaylist = async ({
  playlist,
  artist,
  album,
  year,
  format,
  output = DEFAULT_OUTPUT_DIRECTORY
}) => {
  const playlistInfo = await getPlaylistInfo({ playlist, artist, album, year })

  const invalidSongs = []
  let index = 1
  for (const song of playlistInfo) {
    artist = toTitleCase(sanitizeString(artist))
    album = toTitleCase(sanitizeString(album))
    const title = toTitleCase(sanitizeString(song.title))
    const albumDirectory = join(output, artist, `${year} - ${album}`)
    const songName = createSongName(title, index, format)
    const outputFile = join(albumDirectory, songName)

    // const albumDirectory = join(output, sanitizeString(toTitleCase(artist)), `${year} - ${sanitizeString(toTitleCase(album))}`)
    // const songName = createSongName(sanitizeString(toTitleCase(song.title)), index, format)
    // const outputFile = join(albumDirectory, songName)

    const duration = await getDuration(outputFile)

    if (!verifyDownloadSong(song, duration, TOLERANCE)) {
      console.log(styleText('red', `Song ${song.id} is not valid`))
      console.log(styleText('red', `Expected duration: ${song.duration.seconds}, actual duration: ${duration}`))
      console.log(styleText('red', '----------------------------------------'))

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
