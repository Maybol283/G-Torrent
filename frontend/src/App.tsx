import { useState } from 'react';
import { FetchMetadata, PickOutputPath, DownloadAndTrim } from '../wailsjs/go/main/App';
import { youtube } from '../wailsjs/go/models';
import { RangeSlider } from './components/RangeSlider';
import { formatDuration } from './format';

function App() {
    const [url, setUrl] = useState('');
    const [meta, setMeta] = useState<youtube.Metadata | null>(null);
    const [range, setRange] = useState<[number, number]>([0, 0]);
    const [savedPath, setSavedPath] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    async function fetchMetadata() {
        setError('');
        setMeta(null);
        setSavedPath('');
        setLoading(true);
        try {
            const result = await FetchMetadata(url);
            setMeta(result);
            setRange([0, result.duration]);
        } catch (err) {
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
        if (!path) return; // user cancelled the dialog

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
        <div id="App" className="min-h-screen mx-auto max-w-2xl px-6 py-8 text-center">
            <h1 className="text-3xl font-bold mb-6">G-Torrent</h1>

            <div className="flex justify-center gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Paste a YouTube URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 max-w-sm px-3 py-1.5 rounded bg-gray-100 text-gray-900 outline-none focus:bg-white"
                    disabled={loading || saving}
                />
                <button
                    onClick={fetchMetadata}
                    disabled={!url || loading || saving}
                    className="px-4 py-1.5 rounded bg-gray-200 text-gray-900 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Fetching…' : 'Fetch'}
                </button>
            </div>

            {error && <div className="my-4 text-red-300">{error}</div>}

            {meta && (
                <div className="flex flex-col items-center gap-2 mt-6">
                    {meta.thumbnail && (
                        <img src={meta.thumbnail} alt="" className="max-w-xs rounded" />
                    )}
                    <h2 className="text-xl font-semibold">{meta.title}</h2>
                    <p className="text-sm text-gray-300">
                        {meta.author} · {formatDuration(meta.duration)}
                    </p>

                    <RangeSlider max={meta.duration} value={range} onChange={setRange} />

                    <button
                        onClick={saveMp3}
                        disabled={saving}
                        className="mt-4 px-4 py-1.5 rounded bg-gray-200 text-gray-900 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving…' : 'Save MP3'}
                    </button>

                    {savedPath && !saving && (
                        <p className="mt-2 text-sm text-green-300 break-all">
                            Saved to: {savedPath}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
