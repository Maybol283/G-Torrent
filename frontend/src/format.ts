export function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const pad = (n: number) => String(n).padStart(2, '0');
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

// parseDuration is the inverse of formatDuration. Accepts:
//   "90"        → 90       (bare seconds)
//   "1:30"      → 90       (M:SS)
//   "1:02:30"   → 3750     (H:MM:SS)
// Returns null on anything else.
export function parseDuration(text: string): number | null {
    const trimmed = text.trim();
    if (trimmed === '') return null;

    const parts = trimmed.split(':');
    if (parts.length > 3) return null;

    const nums = parts.map((p) => Number(p));
    if (nums.some((n) => !Number.isFinite(n) || n < 0)) return null;

    let seconds = 0;
    if (nums.length === 1) {
        seconds = nums[0];
    } else if (nums.length === 2) {
        seconds = nums[0] * 60 + nums[1];
    } else {
        seconds = nums[0] * 3600 + nums[1] * 60 + nums[2];
    }

    return seconds;
}
