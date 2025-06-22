export const getVideoUrl = (videoId) => {
  return `http://www.youtube.com/watch?v=${videoId}`
}

export const getPlaylistUrl = (playlistId) => {
  return `http://www.youtube.com/playlist?list=${playlistId}`
}

export const getSearchUrl = (searchTerm) => {
  return `http://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}`
}
