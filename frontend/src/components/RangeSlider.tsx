import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { formatDuration } from '../format';

interface Props {
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
}

export function RangeSlider({ max, value, onChange }: Props) {
    const [start, end] = value;
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
            <div className="flex justify-between mt-2 text-sm text-gray-300">
                <span>{formatDuration(start)}</span>
                <span>{formatDuration(end)}</span>
            </div>
        </div>
    );
}
