#!/usr/bin/env bash
set -euo pipefail

# ==========================================================
# Config Defaults
# ==========================================================
DRY_RUN=false
FORCE=false
EMBED_COVER=true
VERBOSE=false
ROOT="."

# ==========================================================
# Colors
# ==========================================================
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
BLUE="\033[0;34m"
NC="\033[0m"

# ==========================================================
# Usage
# ==========================================================
usage() {
  cat <<EOF
Usage: flac-tag [options]

Options:
  --root <path>     Root directory (default: .)
  --dry-run         Preview changes without modifying files
  --force           Retag even if metadata matches
  --no-cover        Do not embed cover.jpg
  --verbose         Show metadata comparison
  --help            Show this help
EOF
}

# ==========================================================
# Parse Flags
# ==========================================================
while [[ $# -gt 0 ]]; do
  case "$1" in
  --root)
    ROOT="$2"
    shift 2
    ;;
  --dry-run)
    DRY_RUN=true
    shift
    ;;
  --force)
    FORCE=true
    shift
    ;;
  --no-cover)
    EMBED_COVER=false
    shift
    ;;
  --verbose)
    VERBOSE=true
    shift
    ;;
  --help)
    usage
    exit 0
    ;;
  *)
    echo "Unknown option: $1"
    usage
    exit 1
    ;;
  esac
done

if ! command -v metaflac >/dev/null 2>&1; then
  echo "metaflac not found. Install with: brew install flac"
  exit 1
fi

# ==========================================================
# Helpers
# ==========================================================
get_tag() {
  metaflac --show-tag="$1" "$2" 2>/dev/null | cut -d= -f2- || true
}

should_skip() {
  local file="$1"
  local artist="$2"
  local album="$3"
  local year="$4"
  local track="$5"
  local title="$6"
  local total="$7"

  local e_artist e_album e_year e_track e_title e_total

  e_artist=$(get_tag ARTIST "$file")
  e_album=$(get_tag ALBUM "$file")
  e_year=$(get_tag DATE "$file")
  e_track=$(get_tag TRACKNUMBER "$file")
  e_title=$(get_tag TITLE "$file")
  e_total=$(get_tag TOTALTRACKS "$file")

  if [[ "$VERBOSE" == true ]]; then
    echo -e "${YELLOW}     Existing → $e_artist | $e_album | $e_year | $e_track | $e_title | $e_total${NC}"
  fi

  [[ "$e_artist" == "$artist" &&
    "$e_album" == "$album" &&
    "$e_year" == "$year" &&
    "$e_track" == "$track" &&
    "$e_title" == "$title" &&
    "$e_total" == "$total" ]]
}

tag_file() {
  local file="$1"
  local artist="$2"
  local album="$3"
  local year="$4"
  local track="$5"
  local total="$6"
  local title="$7"
  local cover="$8"

  metaflac --remove-all-tags "$file"

  metaflac \
    --set-tag="ARTIST=$artist" \
    --set-tag="ALBUM=$album" \
    --set-tag="DATE=$year" \
    --set-tag="TRACKNUMBER=$track" \
    --set-tag="TOTALTRACKS=$total" \
    --set-tag="TITLE=$title" \
    "$file"

  if [[ "$EMBED_COVER" == true && -f "$cover" ]]; then
    metaflac --import-picture-from="$cover" "$file"
  fi
}

# ==========================================================
# Main
# ==========================================================
current_album=""

find "$ROOT" -type f -name "*.flac" | sort | while read -r file; do
  filename="$(basename "$file")"
  album_path="$(dirname "$file")"
  album_dir="$(basename "$album_path")"
  artist_dir="$(basename "$(dirname "$album_path")")"

  if [[ "$album_dir" != *" - "* ]] || [[ "$filename" != *" - "* ]]; then
    echo -e "${RED}Skipping invalid structure:${NC} $file"
    continue
  fi

  year="${album_dir%% - *}"
  album="${album_dir#* - }"
  track="${filename%% - *}"
  title="${filename#* - }"
  title="${title%.flac}"

  album_key="$artist_dir/$album_dir"

  if [[ "$album_key" != "$current_album" ]]; then
    current_album="$album_key"
    total_tracks=$(find "$album_path" -maxdepth 1 -name "*.flac" | wc -l | tr -d ' ')
    cover_file="$album_path/cover.jpg"

    echo
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE} ARTIST:${NC} $artist_dir"
    echo -e "${BLUE} ALBUM :${NC} $album ($year)"
    echo -e "${BLUE} TRACKS:${NC} $total_tracks"
    echo -e "${BLUE}============================================================${NC}"
  fi

  if [[ "$FORCE" == false ]] && should_skip "$file" "$artist_dir" "$album" "$year" "$track" "$title" "$total_tracks"; then
    echo -e "  ${GREEN}[OK]${NC} $track - $title"
    continue
  fi

  echo -e "  ${YELLOW}[TAG]${NC} $track - $title"

  if [[ "$DRY_RUN" == false ]]; then
    tag_file "$file" "$artist_dir" "$album" "$year" "$track" "$total_tracks" "$title" "$cover_file"
  fi

done

if [[ "$DRY_RUN" == true ]]; then
  echo
  echo -e "${YELLOW}Dry run complete. No files modified.${NC}"
fi
