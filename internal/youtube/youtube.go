package youtube

import (
	"context"
	"fmt"
	"io"
	"strings"

	kkdai "github.com/kkdai/youtube/v2"
)

// Metadata is the subset of video info we expose to the frontend.
// JSON tags are what Wails uses when serialising across the Go↔JS boundary.
type Metadata struct {
	Title     string  `json:"title"`
	Duration  float64 `json:"duration"` // seconds
	Thumbnail string  `json:"thumbnail"`
	ID        string  `json:"id"`
	Author    string  `json:"author"`
}

func FetchMetadata(ctx context.Context, url string) (Metadata, error) {
	client := kkdai.Client{}
	video, err := client.GetVideoContext(ctx, url)
	if err != nil {
		return Metadata{}, fmt.Errorf("fetch video: %w", err)
	}

	thumb := ""
	if n := len(video.Thumbnails); n > 0 {
		thumb = video.Thumbnails[n-1].URL // kkdai returns them low→high res
	}

	return Metadata{
		Title:     video.Title,
		Duration:  video.Duration.Seconds(),
		Thumbnail: thumb,
		ID:        video.ID,
		Author:    video.Author,
	}, nil
}

// OpenAudioStream returns a ReadCloser over the best audio-only format
// for the given URL plus a container hint ("m4a" / "webm" / ""). The
// caller MUST close the stream when done.
func OpenAudioStream(ctx context.Context, url string) (io.ReadCloser, string, error) {
	client := kkdai.Client{}
	video, err := client.GetVideoContext(ctx, url)
	if err != nil {
		return nil, "", fmt.Errorf("fetch video: %w", err)
	}

	formats := video.Formats.WithAudioChannels()
	if len(formats) == 0 {
		return nil, "", fmt.Errorf("no audio formats available")
	}

	best := pickBestAudio(formats)
	stream, _, err := client.GetStreamContext(ctx, video, best)
	if err != nil {
		return nil, "", fmt.Errorf("open stream: %w", err)
	}

	return stream, containerHint(best.MimeType), nil
}

func pickBestAudio(formats kkdai.FormatList) *kkdai.Format {
	var best *kkdai.Format
	for i := range formats {
		f := &formats[i]
		if !strings.HasPrefix(f.MimeType, "audio/") {
			continue
		}
		if best == nil || f.Bitrate > best.Bitrate {
			best = f
		}
	}
	if best == nil {
		// No audio-only stream — fall back to the first audio-bearing format.
		best = &formats[0]
	}
	return best
}

func containerHint(mime string) string {
	switch {
	case strings.Contains(mime, "mp4"):
		return "m4a"
	case strings.Contains(mime, "webm"):
		return "webm"
	}
	return ""
}
