import { useEffect, useRef, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { FetchMetadata, PickOutputPath, DownloadAndTrim } from '../wailsjs/go/main/App';
import { youtube } from '../wailsjs/go/models';
import { RangeSlider } from './components/RangeSlider';
import { Spinner } from './components/Spinner';
import { ThemeToggle } from './components/ThemeToggle';
import { CatToggle } from './components/CatToggle';
import { CatModeBadge } from './components/CatModeBadge';
import { FeaturePills } from './components/FeaturePills';
import { formatDuration } from './format';
import nyanGif from './assets/cats/nyan.gif';
import thiefGif from './assets/cats/thief.gif';

// Thief gif is ~2.59s per loop; ensure at least one full play before transitioning
// out of the loading state on success. On error we transition immediately.
const MIN_LOADING_DISPLAY_MS = 1500;

const cardClass =
    'rounded-2xl border bg-white border-slate-200 shadow-sm dark:bg-slate-900/60 dark:border-slate-700/60 dark:shadow-2xl dark:shadow-black/40';

const primaryBtnClass =
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500 text-white font-semibold tracking-wide shadow-lg shadow-violet-500/20 hover:bg-violet-600 dark:hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors';

function App() {
    const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
    const [catMode, setCatMode] = useState(() => localStorage.getItem('catMode') === 'on');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    }, [dark]);

    useEffect(() => {
        localStorage.setItem('catMode', catMode ? 'on' : 'off');
    }, [catMode]);

    const [url, setUrl] = useState('');
    const [meta, setMeta] = useState<youtube.Metadata | null>(null);
    const [range, setRange] = useState<[number, number]>([0, 0]);
    const [savedPath, setSavedPath] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    // Bumped on every fetch click so the thief gif's <img> remounts and
    // restarts from frame 0 instead of resuming mid-loop.
    const [fetchAttempt, setFetchAttempt] = useState(0);

    // Suppress conveyor animation on the very first render so FETCH and the
    // cat don't slide on app start; only animate on actual loading toggles.
    const isFirstRender = useRef(true);
    useEffect(() => {
        isFirstRender.current = false;
    }, [loading]);

    async function fetchMetadata() {
        setError('');
        setMeta(null);
        setSavedPath('');
        setFetchAttempt((n) => n + 1);
        setLoading(true);
        const startTime = Date.now();
        try {
            const result = await FetchMetadata(url);
            // Hold the loading state long enough for the gif to play once.
            const elapsed = Date.now() - startTime;
            const remaining = MIN_LOADING_DISPLAY_MS - elapsed;
            if (remaining > 0) {
                await new Promise((resolve) => setTimeout(resolve, remaining));
            }
            setMeta(result);
            setRange([0, result.duration]);
        } catch (err) {
            // Error path: transition out immediately, skip the minimum-display wait.
            setError(String(err));
        } finally {
            setLoading(false);
        }
    }

    async function saveMp3() {
        if (!meta) return;
        setError('');
        setSavedPath('');

        let path: string;
        try {
            path = await PickOutputPath(meta.title);
        } catch (err) {
            setError(String(err));
            return;
        }
        if (!path) return;

        setSaving(true);
        try {
            await DownloadAndTrim(url, range[0], range[1], path);
            setSavedPath(path);
        } catch (err) {
            setError(String(err));
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="relative min-h-screen mx-auto max-w-2xl px-6 py-4 space-y-4">
            <div className="absolute top-3 right-3 flex gap-2">
                <CatToggle catMode={catMode} onChange={setCatMode} />
                <ThemeToggle dark={dark} onChange={setDark} />
            </div>

            <header className="flex flex-col items-center gap-1.5 text-center">
                {catMode && <CatModeBadge />}
                <h1 className="text-3xl font-extrabold tracking-tight">G-Torrent</h1>
            </header>

            <div className="relative flex items-center rounded-xl bg-white border border-slate-300 focus-within:border-violet-400 dark:bg-slate-900/60 dark:border-slate-700/60 dark:focus-within:border-violet-400 shadow-sm dark:shadow-2xl dark:shadow-black/40 transition-colors">
                <Search
                    size={18}
                    className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none"
                />
                <input
                    type="text"
                    placeholder="Paste a YouTube URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading || saving}
                    className="flex-1 min-w-0 pl-10 pr-2 py-2.5 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none disabled:opacity-60"
                />
                <button
                    onClick={fetchMetadata}
                    disabled={!url || loading || saving}
                    className="inline-flex items-center justify-center mr-1.5 my-1 px-4 py-1.5 rounded-lg bg-violet-500 text-white font-semibold tracking-wide hover:bg-violet-600 dark:hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {catMode ? (
                        <div className="relative w-20 h-7 overflow-hidden">
                            <span
                                className={`absolute inset-0 flex items-center justify-center ${
                                    isFirstRender.current
                                        ? ''
                                        : loading
                                            ? 'animate-slide-out-right'
                                            : 'animate-slide-in-from-left'
                                }`}
                            >
                                FETCH
                            </span>
                            <span
                                className={`absolute inset-0 flex items-center justify-center ${
                                    isFirstRender.current
                                        ? 'translate-x-full'
                                        : loading
                                            ? 'animate-slide-in-from-left'
                                            : 'animate-slide-out-right'
                                }`}
                            >
                                <img src={nyanGif} alt="" className="h-28" />
                            </span>
                        </div>
                    ) : loading ? (
                        <span className="inline-flex items-center gap-2">
                            <Spinner /> Fetching…
                        </span>
                    ) : (
                        'FETCH'
                    )}
                </button>
            </div>

            <FeaturePills />

            {loading && catMode && (
                <div className="flex justify-center">
                    <img
                        key={fetchAttempt}
                        src={`${thiefGif}?v=${fetchAttempt}`}
                        alt="Thief cat at work"
                        className="h-64 w-auto rounded-xl"
                    />
                </div>
            )}

            {error && (
                <div className="rounded-xl px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-500/15 dark:border-rose-500/30 dark:text-rose-200">
                    {error}
                </div>
            )}

            {meta && (
                <div className={`${cardClass} p-4`}>
                    <div className="flex items-center gap-4">
                        {meta.thumbnail && (
                            <img
                                src={meta.thumbnail}
                                alt=""
                                className="h-24 w-auto rounded-lg shadow-md flex-shrink-0"
                            />
                        )}
                        <div className="flex-1 min-w-0 space-y-0.5">
                            <h2 className="text-base font-semibold leading-tight truncate">{meta.title}</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {meta.author} <span className="mx-1">·</span> {formatDuration(meta.duration)}
                            </p>
                        </div>
                    </div>

                    <RangeSlider max={meta.duration} value={range} onChange={setRange} />

                    <div className="mt-3 flex justify-center">
                        <button
                            onClick={saveMp3}
                            disabled={saving}
                            className={primaryBtnClass}
                        >
                            {saving ? (
                                <>
                                    <Spinner /> SAVING…
                                </>
                            ) : (
                                <>
                                    <Download size={18} /> SAVE MP3
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {savedPath && !saving && (
                <div className="rounded-xl px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-200 break-all">
                    Saved to: {savedPath}
                </div>
            )}
        </div>
    );
}

export default App;
