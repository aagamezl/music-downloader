import {
  createWriteStream,
  existsSync,
  mkdirSync,
  rmSync
} from 'node:fs'
import { join } from 'node:path'
import { parseArgs, styleText } from 'node:util'

import { Innertube, Platform } from 'youtubei.js';

import { convert } from './src/cli/convert.js';
import {
  createSongName,
  sanitizeString,
  toTitleCase,
  verifyPlaylist
} from './src/utils/index.js';

const DOWNLOAD_DELAY = 10_000;  // 10 seconds
const TARGET_LOUDNESS = -24
export const DEFAULT_OUTPUT_DIRECTORY = `./downloads`;

Platform.shim.eval = async (data, env) => {
  const properties = [];

  if (env.n) {
    properties.push(`n: exportedVars.nFunction("${env.n}")`)
  }

  if (env.sig) {
    properties.push(`sig: exportedVars.sigFunction("${env.sig}")`)
  }

  const code = `${data.output}\nreturn { ${properties.join(', ')} }`;

  return new Function(code)();
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * @param {string} playlist
 * @param {string} format
 * @param {string} artistName
 * @param {string} albumName
 */
const downloadPlaylist = async ({
  format,
  playlist,
  artist,
  album,
  year,
  output = DEFAULT_OUTPUT_DIRECTORY
}) => {
  if (!playlist) {
    throw new Error('Playlist ID is required')
  }

  console.log(styleText('cyan', `Fetching playlist info for: ${playlist}\n`))
  const innertube = await Innertube.create({
    // generate_session_locally: true
    client_type: 'ANDROID'
  });

  if (!existsSync(output)) {
    mkdirSync(output);
  }

  const result = await innertube.music.getPlaylist(playlist)
  artist = toTitleCase(sanitizeString(artist))
  album = toTitleCase(sanitizeString(album))

  let index = 1
  let total = result.contents.length
  for (const song of result.contents) {
    if (!song.id) {
      console.log(styleText('red', 'Skipping song without ID:'), song.title)

      continue
    }

    const title = toTitleCase(sanitizeString(song.title))
    const tempFile = join(output, `${song.id}.m4a`)
    const albumDirectory = join(output, artist, `${year} - ${album}`)
    const songName = createSongName(title, index, format)
    const outputFile = join(albumDirectory, songName)

    console.log(`${styleText('yellow', `[${index}/${total}]`)} Downloading - ${title}`)

    const stream = await innertube.download(song.id, {
      type: 'video+audio',
      // quality: 'best'
    });

    const file = createWriteStream(tempFile);

    for await (const chunk of stream) {
      file.write(chunk)
    }

    file.end()

    if (!existsSync(albumDirectory)) {
      mkdirSync(albumDirectory, { recursive: true });
    }

    await convert({
      stream: tempFile,
      format,
      targetLoudness: TARGET_LOUDNESS,
      downloadPath: outputFile
    })

    rmSync(tempFile)

    console.log(styleText('cyan', `\nWaiting ${DOWNLOAD_DELAY / 1000} seconds to start next download...\n`))

    await wait(DOWNLOAD_DELAY)

    index++;
  }
}

const main = async () => {
  const options = {
    output: {
      type: 'string',
      short: 'o',
    },
    format: {
      type: 'string',
      short: 'f',
    },
    playlist: {
      type: 'string',
      short: 'p',
    },
    artist: {
      type: 'string',
      short: 'a',
    },
    album: {
      type: 'string',
      short: 'b',
    },
    year: {
      type: 'string',
      short: 'y',
    },
  };

  const { values } = parseArgs({
    options,
  })

  // values.format = 'flac'
  // values.playlist = 'OLAK5uy_kIVFX1tkjBnGwrosyyuAcBKn85SRilCT0'
  // values.artist = 'Estopa'
  // values.album = 'Estopía'
  // values.year = '2024'

  console.log(styleText('cyan', '\nDownloading playlist...'));

  await downloadPlaylist(values)

  console.log(styleText('green', 'Playlist download complete'))

  console.log(styleText('cyan', '---------------------------------------------------------------'))

  console.log(styleText('cyan', '\nVerifying playlist...'))

  const invalidSongs = await verifyPlaylist(values)

  if (invalidSongs.length > 0) {
    for (const song of invalidSongs) {
      console.log(styleText('red', `Song ${song.id}: ${song.title} is not valid`))
      console.log(styleText('red', `Expected duration: ${song.duration.seconds}, downloaded duration: ${song.downloadedDuration}`))
    }

    process.exit(1)
  }

  console.log(styleText('green', 'Playlist verification complete, all songs are valid'))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

