# YouTube Music Downloader

A command-line tool for downloading YouTube videos as MP3 files.

## Description

This project is a Node.js application that allows you to easily download YouTube videos as MP3 files. It provides a simple command-line interface for searching, downloading, and converting YouTube videos to audio format.

## Features

- Search YouTube videos by keyword
- Download videos as MP3 files
- Support for playlists download
- Automatic file naming with video title
- Progress tracking during downloads
- Configurable output directory

## Installation

1. Clone the repository:
```bash
git clone https://github.com/aagamezl/music-downloader.git
cd music-downloader
```

2. Install dependencies:
```bash
npm install
```

## Usage

```bash
node bin/music-downloader.js <command> [options]
```

### Commands

- `download`: Download a YouTube video
- `search`: Search for YouTube videos
- `playlist`: Download a YouTube playlist
- `list`: Manage download lists

### Options

- `-d, --download <videoId>`: Download a specific video by its ID
- `-o, --output <directory>`: Specify output directory for downloaded files
- `-l, --list <listId>`: Specify list ID for list download
- `-h, --help`: Show help information

Example usage:
```bash
# Download a specific video
node bin/music-downloader.js -d VIDEO_ID -o /path/to/output

# Download a list of videos
node bin/music-downloader.js -l LIST_ID -o /path/to/output

# Download to specific directory
node bin/music-downloader.js -d VIDEO_ID -o /path/to/output

# Show help
node bin/music-downloader.js -h
```

## Dependencies

- Node.js >= 14.0.0
- npm
- @devnetic/cli
- @devnetic/utils
- ffmpeg-static
- fluent-ffmpeg
- ytdl-core
- ytpl
- ytsr

## License

This project is licensed under the MIT License - see the LICENSE file for details.
