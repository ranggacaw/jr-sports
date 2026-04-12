export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={`button-danger ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
