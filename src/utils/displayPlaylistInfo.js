
import { toTitleCase } from './toTitleCase.js';

export const displayPlaylistInfo = (playlistInfo) => {
  console.log('Playlist info: \n')

  playlistInfo.forEach((song, index) => {
    console.log(`Index: ${index + 1}`);
    console.log(`Title: ${toTitleCase(song.title)}`)
    console.log(`Artist: ${toTitleCase(song.artist)}`)
    console.log(`Album: ${toTitleCase(song.album)}`)
    console.log(`Year: ${song.year}`)
    console.log(`Duration: ${song?.duration?.text}`)
    console.log('--------------------------------------');
  })
}
