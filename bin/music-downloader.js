const { writeFileSync } = require('fs')

const { getParams, usage, format } = require('@devnetic/cli')
const { getType } = require('@devnetic/utils')

const downloadVideo = require('../src/cli/download')
const getItems = require('../src/cli/getItems')
const getPlaylist = require('../src/cli/getPlaylist')
const search = require('../src/cli/search')
const showUsage = require('../src/cli/usage')

const params = getParams()
const errorLogger = format.bold().red

// params.p = 'RDEMjg0J_KBOTJNZiAPRD8iixg'
// params.p = 'UU_aEa8K-EOJ3D6gOs7HcyNg'
// console.log(params)

const main = async () => {
  if (params.help || params.h) {
    console.log(showUsage())
  }

  const videoId = params.d || params.download

  if (videoId) {
    if (getType(videoId) !== 'String') {
      console.error(errorLogger('Invalid video ID'))

      return
    }

    const output = params.o || params.output

    try {
      const playlist = await downloadVideo(videoId, output)
    } catch (error) {
      console.error(errorLogger(error.message))

      return
    }
  }

  const searchTerm = params.s || params.search

  if (searchTerm) {
    if (getType(searchTerm) !== 'String') {
      console.error(errorLogger('Invalid video ID'))

      return
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

      return
    }
  }

  const playlistId = params.p || params.playlist

  if (playlistId) {
    if (getType(playlistId) !== 'String') {
      console.error(errorLogger('Invalid playlist ID'))

      return
    }

    try {
      const result = await getPlaylist(playlistId)

      const items = getItems(result)

      const output = params.o || params.output

      for (const { id } of items) {
        await downloadVideo(id, output)
      }

      // writeFileSync(`${playlistId}.txt`, JSON.stringify(result, null, 2))
      // writeFileSync(`${playlistId}-items.txt`, JSON.stringify(items, null, 2))
    } catch (error) {
      console.error(errorLogger(error.message))

      return
    }
  }
}

main()
