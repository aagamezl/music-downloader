# YouTube Music Downloader

A powerful command-line tool for downloading YouTube playlists as high-quality audio files with proper metadata tagging.

## ⚠️ Important: YouTube Rate Limiting Warning

**DO NOT download playlists or videos too quickly!** YouTube implements strict IP-based rate limiting that can temporarily ban your IP address if you make too many requests in a short period.

**Recommended Guidelines:**
- **Wait at least 10 seconds between each video download** (built into the tool)
- **Avoid running multiple download sessions simultaneously**
- **Take breaks between large playlists** (50+ songs)
- **If you get rate limited, wait 30+ minutes before retrying**

If your IP gets banned, you may see errors like "Too many requests" or videos failing to download. The only solution is to wait for the ban to expire.

## Features

- Download entire YouTube playlists as high-quality audio
- Support for multiple audio formats (MP3, FLAC, etc.)
- Automatic metadata tagging (artist, album, year, track numbers)
- Spanish character preservation (ñ, Ñ, á, é, í, ó, ú, ü)
- Filesystem-safe filename sanitization
- Built-in download delays to prevent IP banning
- Playlist verification after download

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

### Basic Playlist Download

```bash
node download-playlist.js --playlist PLAYLIST_ID --artist "Artist Name" --album "Album Name" --year 2024
```

### Command Line Options

- `-p, --playlist <id>`: YouTube playlist ID (required)
- `-a, --artist <name>`: Artist name for metadata (required)
- `-b, --album <name>`: Album name for metadata (required)
- `-y, --year <year>`: Album year for metadata (required)
- `-f, --format <format>`: Audio format (default: mp3, options: mp3, flac, etc.)
- `-o, --output <directory>`: Output directory (default: ./downloads)

### FLAC Metadata Tagging

For FLAC files, you can use the included `flac-tag.sh` script to add proper metadata tags:

```bash
./bin/flac-tag.sh [options]
```

**Script Options:**
- `--root <path>`: Root directory to scan (default: current directory)
- `--dry-run`: Preview changes without modifying files
- `--force`: Retag even if metadata already matches
- `--no-cover`: Do not embed cover.jpg images
- `--verbose`: Show metadata comparison for each file
- `--help`: Show help information

**Expected Directory Structure:**
```
downloads/
├── Artist Name/
│   ├── Year - Album Name/
│   │   ├── 01 - Song Title.flac
│   │   ├── 02 - Another Song.flac
│   │   ├── cover.jpg
│   │   └── ...
```

**Examples:**
```bash
# Tag all FLAC files in downloads directory
./bin/flac-tag.sh --root ./downloads

# Preview what would be tagged
./bin/flac-tag.sh --root ./downloads --dry-run

# Force retag all files
./bin/flac-tag.sh --root ./downloads --force

# Tag without embedding cover art
./bin/flac-tag.sh --root ./downloads --no-cover
```

**Requirements:**
- Requires `metaflac` (install with `brew install flac` on macOS)
- Automatically detects artist, album, year, track, and title from file structure
- Embeds cover.jpg if present in album directory
- Preserves existing metadata by default (use `--force` to override)

### Examples

#### Download a FLAC album:
```bash
node download-playlist.js \
  --playlist OLAK5uy_kIVFX1tkjBnGwrosyyuAcBKn85SRilCT0 \
  --artist "Estopa" \
  --album "Estopía" \
  --year 2024 \
  --format flac
```

#### Download to custom directory:
```bash
node download-playlist.js \
  --playlist PLK-SXHR04gppC3Kp0b9ck1D5RDKx3_q3I \
  --artist "The Interrupters" \
  --album "The Interrupters (Deluxe Edition)" \
  --year 2014 \
  --format flac \
  --output ./my-music
```

#### Download MP3 format:
```bash
node download-playlist.js \
  --playlist OLAK5uy_l2PdJzx6eoU9JiVqs9u1GPgvNdj1FK1SY \
  --artist "Viva Suecia" \
  --album "Hecho en tiempos de paz" \
  --year 2025 \
  --format mp3
```

## Finding Playlist IDs

YouTube playlist IDs can be found in the URL:
- `https://music.youtube.com/playlist?list=OLAK5uy_kIVFX1tkjBnGwrosyyuAcBKn85SRilCT0`
- The playlist ID is: `OLAK5uy_kIVFX1tkjBnGwrosyyuAcBKn85SRilCT0`

## Download Process

1. **Initialization**: Connects to YouTube and validates the playlist
2. **Sequential Download**: Downloads each video with 10-second delays
3. **Audio Conversion**: Converts video to selected audio format
4. **Metadata Tagging**: Adds artist, album, year, and track information
5. **Verification**: Checks all files were downloaded successfully

## File Organization

Downloaded files are organized as:
```
downloads/
├── Artist Name/
│   ├── Album Name/
│   │   ├── 01 - Song Title.flac
│   │   ├── 02 - Another Song.flac
│   │   └── ...
```

## Spanish Character Support

The tool preserves Spanish characters in filenames and metadata:
- ✅ Preserved: ñ, Ñ, á, é, í, ó, ú, ü, ¿, ¡
- ❌ Removed: / \ : * ? " < > | (filesystem-incompatible characters)

## Testing

Run the test suite:
```bash
npm test
```

## Dependencies

- Node.js >= 18.0.0
- youtubei.js - YouTube API client
- fluent-ffmpeg - Audio conversion
- ffmpeg-static - FFmpeg binaries

## Troubleshooting

### Rate Limiting Issues
If you encounter rate limiting:
1. Stop all downloads immediately
2. Wait at least 30 minutes
3. Restart with a single playlist
4. Monitor for any error messages

### Failed Downloads
The tool automatically verifies downloads and will report any missing files. Simply re-run the same command to resume failed downloads.

### Audio Quality
For best audio quality:
- Use `--format flac` for lossless audio
- Ensure you have sufficient disk space (FLAC files are larger)
- Check that the source videos have high-quality audio

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Remember**: Be respectful of YouTube's terms of service and rate limits. This tool is for personal use only.
