import { usage } from '@devnetic/cli'

export const showUsage = () => {
  usage('Usage: $0 <command> [options]')
    .option(['-v', '--video'], '\t\tDownload a specific video by its ID')
    .option(['-p', '--playlist'], '\tDownload a YouTube playlist')
    .option(['-s', '--search'], '\tSearch and download videos by keyword')
    .option(['-o', '--output'], '\tDownload output')
    .option(['-h', '--help'], '\t\tShow help')
    .epilog(`Copyright ${new Date().getFullYear()} - Music Downloader`)
    .show()

  process.exit(0)
}
