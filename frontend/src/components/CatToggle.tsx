import { Cat } from 'lucide-react';

interface Props {
    catMode: boolean;
    onChange: (catMode: boolean) => void;
}

export function CatToggle({ catMode, onChange }: Props) {
    return (
        <button
            onClick={() => onChange(!catMode)}
            aria-label={catMode ? 'Disable cat mode' : 'Enable cat mode'}
            className={`p-2 rounded-full transition-colors ${
                catMode
                    ? 'bg-violet-500/20 text-violet-500 hover:bg-violet-500/30 dark:text-violet-300'
                    : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700/60'
            }`}
        >
            <Cat size={18} />
        </button>
    );
}
