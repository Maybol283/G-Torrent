interface Props {
    size?: number;
    className?: string;
}

export function Spinner({ size = 16, className = '' }: Props) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className={`animate-spin ${className}`}
            aria-hidden="true"
        >
            <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray="40 60"
                strokeLinecap="round"
            />
        </svg>
    );
}
