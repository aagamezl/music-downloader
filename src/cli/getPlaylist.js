import ytpl from '@distube/ytpl'

import { getPlaylistUrl } from './getUrl.js'

export const getPlaylist = async (id) => {
  if (typeof id !== 'string' || !id.trim()) {
    throw new Error('Invalid playlist ID')
  }

  const playlist = await ytpl(getPlaylistUrl(id.trim()))

  if (!playlist || !playlist.items || playlist.items.length === 0) {
    throw new Error('No items found in the playlist')
  }

  return playlist
}
