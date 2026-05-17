import { Music2, Scissors, Zap } from 'lucide-react';

const pills = [
    { icon: Music2, label: '192KBPS MP3' },
    { icon: Scissors, label: 'PRECISE TRIM' },
    { icon: Zap, label: 'INSTANT DOWNLOAD' },
];

export function FeaturePills() {
    return (
        <div className="flex flex-wrap justify-center gap-4 text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">
            {pills.map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5">
                    <Icon size={14} className="text-violet-500 dark:text-violet-400" />
                    {label}
                </span>
            ))}
        </div>
    );
}
