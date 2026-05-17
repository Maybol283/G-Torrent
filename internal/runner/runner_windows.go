//go:build windows

package runner

import (
	"context"
	"os/exec"
	"syscall"
)

// createNoWindow is the Windows process-creation flag that suppresses
// the console window. The constant isn't exposed by the frozen syscall
// package; we define it locally to avoid pulling in golang.org/x/sys.
// https://learn.microsoft.com/en-us/windows/win32/procthread/process-creation-flags
const createNoWindow = 0x08000000

// Command builds an exec.Cmd that does not pop a CMD window on Windows.
// Always pass a context so closing the app kills the child process.
func Command(ctx context.Context, name string, args ...string) *exec.Cmd {
	cmd := exec.CommandContext(ctx, name, args...)
	cmd.SysProcAttr = &syscall.SysProcAttr{
		HideWindow:    true,
		CreationFlags: createNoWindow,
	}
	return cmd
}
