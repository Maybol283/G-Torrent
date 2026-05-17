package ffmpeg

import (
	"bytes"
	"context"
	"fmt"
	"io"

	"G-Torrent/internal/bin"
	"G-Torrent/internal/runner"
)

// TrimToMP3 reads audio from `input`, trims it to [startSec, endSec],
// and writes a 192kbps MP3 to outputPath. ffmpeg is auto-located.
func TrimToMP3(ctx context.Context, input io.Reader, startSec, endSec float64, outputPath string) error {
	ffmpegPath, err := bin.EnsureFfmpeg(ctx)
	if err != nil {
		return fmt.Errorf("ensure ffmpeg: %w", err)
	}

	cmd := runner.Command(ctx, ffmpegPath,
		"-y", "-i", "pipe:0",
		"-ss", fmt.Sprintf("%.3f", startSec),
		"-to", fmt.Sprintf("%.3f", endSec),
		"-b:a", "192k", "-vn", "-acodec", "libmp3lame",
		outputPath,
	)
	cmd.Stdin = input
	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("ffmpeg: %w: %s", err, tail(stderr.String(), 600))
	}
	return nil
}

func tail(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return "..." + s[len(s)-n:]
}
