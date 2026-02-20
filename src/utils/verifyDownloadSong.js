export const verifyDownloadSong = (song, duration, tolerance = 1) => {
  if (Math.abs(song.duration.seconds - duration) > tolerance) {
    return false;
  }

  return true;
}
