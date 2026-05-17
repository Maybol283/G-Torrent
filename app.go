package main

import (
	"context"
	"fmt"

	"G-Torrent/internal/bin"
	"G-Torrent/internal/ffmpeg"
	"G-Torrent/internal/paths"
	"G-Torrent/internal/runner"
	"G-Torrent/internal/youtube"

	wruntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Ping() string {
	return "pong"
}

func (a *App) EnsureFfmpeg() (string, error) {
	return bin.EnsureFfmpeg(a.ctx)
}

func (a *App) FetchMetadata(url string) (youtube.Metadata, error) {
	return youtube.FetchMetadata(a.ctx, url)
}

// DownloadAndTrim opens the YouTube audio stream, pipes it through
// ffmpeg with the trim range, and writes the resulting MP3 to outputPath.
func (a *App) DownloadAndTrim(url string, startSec, endSec float64, outputPath string) error {
	stream, _, err := youtube.OpenAudioStream(a.ctx, url)
	if err != nil {
		return fmt.Errorf("open audio: %w", err)
	}
	defer stream.Close()

	if err := ffmpeg.TrimToMP3(a.ctx, stream, startSec, endSec, outputPath); err != nil {
		return fmt.Errorf("trim: %w", err)
	}
	return nil
}

// PickOutputPath opens the native Save-As dialog with a suggested
// .mp3 filename derived from the video title. Returns "" if the user
// cancelled the dialog.
func (a *App) PickOutputPath(suggestedName string) (string, error) {
	return wruntime.SaveFileDialog(a.ctx, wruntime.SaveDialogOptions{
		DefaultFilename: paths.Sanitise(suggestedName) + ".mp3",
		Filters: []wruntime.FileFilter{
			{DisplayName: "MP3 Audio (*.mp3)", Pattern: "*.mp3"},
		},
	})
}

// FfmpegVersion is a temporary smoke test for the runner package.
// Remove once DownloadAndTrim is wired up.
func (a *App) FfmpegVersion() (string, error) {
	path, err := bin.EnsureFfmpeg(a.ctx)
	if err != nil {
		return "", fmt.Errorf("ensure ffmpeg: %w", err)
	}
	out, err := runner.Command(a.ctx, path, "-version").CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("run ffmpeg: %w", err)
	}
	return string(out), nil
}
