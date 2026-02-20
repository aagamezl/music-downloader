#!/bin/bash

# curl -H "User-Agent: YourAppName/1.0 ( [email protected] )" \
#   "https://musicbrainz.org/ws/2/recording/?query=<your_search_query>&fmt=json" | jq

# Default values
SEARCH_TYPE="recording"
LIMIT=5
OUTPUT_FORMAT="table"
USER_AGENT="MusicBrainzSearch/1.0 (your-email@example.com)"
ARTIST=""
QUERY=""

# ==========================================================
# Usage
# ==========================================================
usage() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS] "SEARCH QUERY"

Search MusicBrainz for tracks, artists, or releases.

OPTIONS:
    -t, --type TYPE      Search type: recording (default), artist, release, or all
    -a, --artist NAME    Filter by artist name (for recording searches)
    -l, --limit NUM      Number of results (default: 5, max: 25)
    -f, --format FORMAT  Output format: table (default), json, or csv
    -u, --user-agent STR User-Agent string
    -h, --help          Show this help

EXAMPLES:
    $(basename "$0") "Bohemian Rhapsody"
    $(basename "$0") -t artist "The Beatles"
    $(basename "$0") -t release -l 10 "Dark Side"
    $(basename "$0") -t recording -a "Queen" "Bohemian Rhapsody"
EOF
}

# ==========================================================
# Parse Flags
# ==========================================================
# Parse flags
while [[ $# -gt 0 ]]; do
  case "$1" in
    -t | --type)
      SEARCH_TYPE="$2"
      shift 2
      ;;
    -a | --artist)
      ARTIST="$2"
      shift 2
      ;;
    -l | --limit)
      LIMIT="$2"
      shift 2
      ;;
    -f | --format)
      OUTPUT_FORMAT="$2"
      shift 2
      ;;
    -u | --user-agent)
      USER_AGENT="$2"
      shift 2
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      QUERY="$1"
      shift
      ;;
  esac
done

# Set defaults
# SEARCH_TYPE=${SEARCH_TYPE:-recording}
# LIMIT=${LIMIT:-5}
# OUTPUT_FORMAT=${OUTPUT_FORMAT:-table}
# USER_AGENT=${USER_AGENT:-"YourAppName/1.0 ( [email protected] )"}


echo "SEARCH_TYPE: $SEARCH_TYPE"
echo "ARTIST: $ARTIST"
echo "LIMIT: $LIMIT"
echo "OUTPUT_FORMAT: $OUTPUT_FORMAT"
echo "USER_AGENT: $USER_AGENT"

make_request() {
  # Build query string
  local query_string=""
  if [[ -n "$QUERY" ]]; then
    query_string="query=$QUERY&"
  elif [[ -n "$ARTIST" ]]; then
    query_string="query=artist:$ARTIST&"
  else
    query_string="query=&"
  fi

# curl -H "User-Agent: MyMusicApp/1.0 ( [email protected] )" \
# "https://musicbrainz.org/ws/2/recording/?query=recording:Radioactive%20AND%20artist:Imagine%20Dragons&fmt=json"

  curl -H "User-Agent: $USER_AGENT" \
    "https://musicbrainz.org/ws/2/$SEARCH_TYPE/?${query_string}fmt=json&limit=$LIMIT${ARTIST:+&artist=$ARTIST}" | jq
}

make_request
