const { usage } = require('@devnetic/cli')

const showUsage = () => {
  usage('Usage: $0 <command> [options]')
    // .option(['-p', '--playlist'], '\tShow the content of a playlist')
    .option(['-d', '--download'], '\tSearches for the given string')
    .option(['-o', '--output'], '\tDownload output')
    // .option(['-s', '--search'], '\tSearches for the given string')
    .option(['-h', '--help'], '\t\tShow help')
    .epilog(`Copyright ${new Date().getFullYear()} - Music Downloader`)
    .show()

  process.exit(0)
}

module.exports = showUsage
