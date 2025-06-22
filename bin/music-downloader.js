import { getParams, usage, format } from '@devnetic/cli'
import { getType } from '@devnetic/utils'

import { downloadVideo } from '../src/cli/download.js'
import { getItems } from '../src/cli/getItems.js'
import { getPlaylist } from '../src/cli/getPlaylist.js'
import { search } from '../src/cli/search.js'
import { showUsage } from '../src/cli/usage.js'

const params = getParams()
const errorLogger = format.bold().red

const WAITING_TIME = 200 // 2 seconds
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// params.p = 'RDEMjg0J_KBOTJNZiAPRD8iixg'
// params.p = 'UU_aEa8K-EOJ3D6gOs7HcyNg'
// params.p = 'PLbRAYIB2Q4mRgSeCAYUYVe18D6KL0yjpS' // Playlist ID
// params.v = 'hk8ute9PTlY'
// params.o = 'downloaded'
// console.log(params)

const main = async () => {
  if (params.h || params.help) {
    showUsage()

    return
  }

  // Check if any command is provided
  const commands = ['v', 'video', 's', 'search', 'p', 'playlist', 'h', 'help'];
  const hasCommand = commands.some(cmd => params[cmd] !== undefined);

  if (!hasCommand) {
    console.error(errorLogger('Error: No command provided. Use -h or --help for usage information.'));
    showUsage()
  }

  // Validate output directory if provided
  const output = params.o || params.output;
  if (!output) {
    console.error(errorLogger(`Error: Output directory is mandatory.`));

    showUsage()
  }

  const downloadResult = {
    success: [],
    failed: []
  }

  const videoId = params.v || params.video

  if (videoId) {
    if (getType(videoId) !== 'string') {
      console.error(errorLogger('Invalid video ID'))

      showUsage()
    }

    try {
      await downloadVideo(videoId, output)
      downloadResult.success.push(videoId)
    } catch (error) {
      console.error(errorLogger(error.message))

      downloadResult.failed.push(videoId)
    }
  }

  const searchTerm = params.s || params.search

  if (searchTerm) {
    if (getType(searchTerm) !== 'String') {
      console.error(errorLogger('Invalid video ID'))

      showUsage()
    }

    try {
      const result = await search(searchTerm)

      const items = getItems(result)

      const output = params.o || params.output

      for (const { id } of items) {
        await downloadVideo(id, output)
      }

      // writeFileSync(`${searchTerm}.txt`, JSON.stringify(result, null, 2))
      // writeFileSync(`${searchTerm}-items.txt`, JSON.stringify(items, null, 2))
    } catch (error) {
      console.error(errorLogger(error.message))

      showUsage()
    }
  }

  const playlistId = params.p || params.playlist

  if (playlistId) {
    if (getType(playlistId) !== 'string') {
      console.error(errorLogger('Error: Invalid playlist ID. Please provide a valid YouTube playlist ID.'));
      showUsage()
    }

    try {
      const result = await getPlaylist(playlistId)

      if (!result || !result.items || result.items.length === 0) {
        console.error(errorLogger('Error: No videos found in the playlist.'));
        showUsage()
      }

      const items = getItems(result)

      if (!items || items.length === 0) {
        console.error(errorLogger('Error: No valid items found in the playlist.'));
        showUsage()
      }

      const output = params.o || params.output

      for (const item of items) {
        if (!item || !item.id || !item.title) {
          console.error(errorLogger(`Error: Invalid item in playlist: ${item ? item.id : 'unknown'}`));
          continue;
        }

        console.log(`Downloading: ${item.title} (${item.id})`)

        // Avoid hitting API limits
        console.log(`Waiting for ${WAITING_TIME} miliseconds before downloading next video...`);

        await sleep(WAITING_TIME)

        await downloadVideo(item.id, output)

        downloadResult.success.push(item.id)
      }
    } catch (error) {
      console.error(errorLogger(`Error: Failed to download playlist - ${error.message}`));

      downloadResult.failed.push(playlistId)
    } finally {
      downloadResult.total = downloadResult.success.length + downloadResult.failed.length
    }
  }

  console.log(format.bold().green('Download completed.'))
  console.log(`Total videos: ${downloadResult.success.length + downloadResult.failed.length}`)
  console.log(`Success: ${downloadResult.success.length}`)
  console.log(`Failed: ${downloadResult.failed.length}`)
}

main()
