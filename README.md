# G-Torrent

Paste a YouTube URL → trim → save as a 192 kbps MP3. Cross-platform desktop app, no installer needed.

[![Latest release](https://img.shields.io/github/v/release/Maybol283/G-Torrent?label=download&logo=github)](https://github.com/Maybol283/G-Torrent/releases/latest)

## Download

Grab the latest build from the [**Releases page**](https://github.com/Maybol283/G-Torrent/releases/latest) — pick the zip matching your OS:

| OS | Asset |
|---|---|
| Windows | `G-Torrent-windows.zip` |
| macOS (Intel + Apple Silicon) | `G-Torrent-macos.zip` |

Or use these direct-download links:

- [Windows direct download](https://github.com/Maybol283/G-Torrent/releases/latest/download/G-Torrent-windows.zip)
- [macOS direct download](https://github.com/Maybol283/G-Torrent/releases/latest/download/G-Torrent-macos.zip)

## First run

### Windows
1. Unzip and double-click `G-Torrent.exe`.
2. Windows will warn **"Windows protected your PC"** — click **More info → Run anyway**.
3. First launch pauses ~2 seconds while ffmpeg unpacks. Subsequent launches are instant.

### macOS
1. Install [Homebrew](https://brew.sh) if you don't already have it.
2. Run `brew install ffmpeg` in Terminal (one-time, ~2 minutes).
3. Unzip the download, then **right-click → Open** the app the first time (regular double-click triggers Gatekeeper since the binary isn't signed). After that, normal double-click works.

## How to use

1. Paste a YouTube URL and click **FETCH**.
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

- [Wails](https://wails.io/) v2 (Go + WebView desktop shell)
- React + TypeScript + Tailwind CSS (UI)
- [`kkdai/youtube/v2`](https://github.com/kkdai/youtube) (video metadata + streams)
- [ffmpeg](https://ffmpeg.org/) (audio extraction + MP3 encoding — bundled on Windows, system-installed on macOS)
