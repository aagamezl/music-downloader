const { } = require('@devnetic/utils')

// const MAX_DURATION = 960000 // 16 minutes
const MAX_DURATION = 16 * 60 // 16 minutes

const getDuration = (duration) => {
  return duration.split(':').reverse().reduce((total, part, index) => {
    total += part * (Math.pow(6, index) * Math.pow(10, index)) * 1000

    return total
  }, 0)
}

const getItems = (searchResult) => {
  return searchResult.items.reduce((items, item) => {
    const {
      author,
      bestThumbnail,
      description,
      durationSec: duration,
      id,
      title,
      type,
    } = item

    // if (type === 'video' && getDuration(duration) <= MAX_DURATION) {
    if (duration <= MAX_DURATION) {
      items.push({ author, bestThumbnail, description, duration, id, title })
    }

    return items
  }, [])
}

module.exports = getItems
