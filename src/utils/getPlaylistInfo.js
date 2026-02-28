import { Innertube } from 'youtubei.js';

export const getPlaylistInfo = async ({
  playlist,
  artist,
  album,
  year
}) => {
  const innertube = await Innertube.create({
    generate_session_locally: true,
    client_type: 'ANDROID',
    retrieve_player: false
  });
  const result = await innertube.music.getPlaylist(playlist)

  const playlistInfo = result.contents.reduce((info, song) => {
    if (!song.id) {
      return info
    }

    info.push({
      id: song.id,
      title: song.title ?? title,
      duration: song.duration,
      artist: song?.artist ?? song?.author ?? song?.authors?.[0]?.name ?? artist,
      album,
      year,
    })

    return info
  }, [])

  return playlistInfo
}
