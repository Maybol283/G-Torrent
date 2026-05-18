//go:build linux || darwin

package runner

import (
	"context"
	"os/exec"
)

// Command builds an exec.Cmd. Linux and macOS have no console-window concern;
// the OS-split exists purely for the Windows variant's sake.
func Command(ctx context.Context, name string, args ...string) *exec.Cmd {
	return exec.CommandContext(ctx, name, args...)
}
