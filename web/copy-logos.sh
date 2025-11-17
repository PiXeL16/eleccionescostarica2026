#!/bin/bash
# Copy party logos to public folder

cd /Users/christopher.jimenez/Src/Personal/Elecciones2026/data/partidos

for dir in */; do
  abbr=$(echo "$dir" | cut -d'-' -f1)
  logo="${dir}${abbr}_logo_1.png"
  if [ -f "$logo" ]; then
    cp "$logo" "/Users/christopher.jimenez/Src/Personal/Elecciones2026/web/public/partidos/${abbr}.png"
    echo "Copied $abbr logo"
  fi
done
