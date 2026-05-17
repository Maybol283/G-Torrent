import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useEffect, useState } from 'react';
import { formatDuration, parseDuration } from '../format';

interface Props {
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
}

export function RangeSlider({ max, value, onChange }: Props) {
    return (
        <div className="w-full max-w-md mx-auto mt-4 px-2">
            <Slider
                range
                min={0}
                max={max}
                step={1}
                allowCross={false}
                value={value}
                onChange={(v) => onChange(v as [number, number])}
            />
            <div className="flex justify-between mt-2 text-sm text-slate-600 dark:text-slate-300">
                <TimeInput
                    value={value[0]}
                    max={max}
                    onChange={(v) => onChange([v, Math.max(v, value[1])])}
                />
                <TimeInput
                    value={value[1]}
                    max={max}
                    onChange={(v) => onChange([Math.min(v, value[0]), v])}
                />
            </div>
        </div>
    );
}

interface TimeInputProps {
    value: number;
    max: number;
    onChange: (value: number) => void;
}

function TimeInput({ value, max, onChange }: TimeInputProps) {
    const [text, setText] = useState(() => formatDuration(value));
    const [focused, setFocused] = useState(false);
    const [invalid, setInvalid] = useState(false);

    // When the slider (or other input) updates `value`, sync the displayed
    // text — but only if the user isn't currently editing this field.
    useEffect(() => {
        if (!focused) {
            setText(formatDuration(value));
            setInvalid(false);
        }
    }, [value, focused]);

    function commit() {
        const parsed = parseDuration(text);
        if (parsed === null || parsed < 0 || parsed > max) {
            setInvalid(true);
            return;
        }
        setInvalid(false);
        setText(formatDuration(parsed));
        if (parsed !== value) onChange(parsed);
    }

    return (
        <input
            type="text"
            value={text}
            onChange={(e) => {
                setText(e.target.value);
                setInvalid(false);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => {
                setFocused(false);
                commit();
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            }}
            className={`w-20 text-center tabular-nums bg-transparent border-b px-1 py-0.5 outline-none transition-colors ${
                invalid
                    ? 'border-rose-400 text-rose-500 dark:text-rose-300'
                    : 'border-transparent hover:border-slate-400 dark:hover:border-slate-500 focus:border-indigo-400 dark:focus:border-indigo-400'
            }`}
        />
    );
}
