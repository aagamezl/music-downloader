import { parseArgs } from 'node:util'

import {
  displayPlaylistInfo,
  getPlaylistInfo
} from './src/utils/index.js';

const main = async () => {
  const options = {
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

  const playlistInfo = await getPlaylistInfo(values)

  displayPlaylistInfo(playlistInfo)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

