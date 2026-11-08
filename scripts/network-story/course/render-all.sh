#!/bin/bash
set -euo pipefail
m="$1"
out="output/network-season/m$m"
node scripts/network-story/course/render.mjs --out="$out"
/tmp/yg-film-audio-check/bin/python scripts/network-story/course/sound.py "$out"
cp scripts/network-story/assets/chuckle.mp3 "$out/chuckle.mp3"
cp scripts/network-story/assets/laugh.mp3 "$out/laugh.mp3"
node scripts/network-story/mix.mjs "$out"
