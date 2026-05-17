import { Cat } from 'lucide-react';

export function CatModeBadge() {
    return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-violet-500/15 text-violet-600 border border-violet-500/30 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-400/30">
            <Cat size={14} />
            CAT MODE ACTIVE
        </div>
    );
}
