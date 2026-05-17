# G-Torrent v0.1.0

Paste a YouTube URL → trim → save as a 192 kbps MP3. Windows-only desktop app, no installer needed.

## Download

Grab **G-Torrent.zip** from the Assets below. Unzip anywhere (Desktop, Downloads, wherever).

## First run

1. Double-click `G-Torrent.exe`.
2. Windows will warn **"Windows protected your PC"** because the binary isn't signed. Click **More info → Run anyway**.
3. First launch pauses ~2 seconds while ffmpeg unpacks itself to `%LOCALAPPDATA%\G-Torrent\`. Subsequent launches are instant.

## How to use

1. Paste a YouTube URL into the search bar and click **FETCH**.
2. Drag the slider thumbs (or type into the time fields) to pick start and end times.
3. Click **SAVE MP3** and choose where to save the file.

## Features

- 🎵 192 kbps MP3 output via libmp3lame
- ✂️ Precise trimming with two-thumb range slider + editable time fields
- 🌙 Light / dark theme toggle (top-right)
- 🐈 **Cat Mode** — for the discerning user who needs a little extra chaos

## Known limitations

- Some videos won't download: age-restricted, region-locked, livestreams, certain music videos. These are kkdai-side limitations — you'll see a readable error rather than a crash.
- YouTube occasionally changes their player and breaks the downloader. If that happens, ping me and I'll push a new build.

## Built with
