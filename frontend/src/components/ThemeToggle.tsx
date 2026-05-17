import { Moon, Sun } from 'lucide-react';

interface Props {
    dark: boolean;
    onChange: (dark: boolean) => void;
}

export function ThemeToggle({ dark, onChange }: Props) {
    return (
        <button
            onClick={() => onChange(!dark)}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-full text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700/60 transition-colors"
        >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}
