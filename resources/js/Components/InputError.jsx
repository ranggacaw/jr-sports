export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'mt-2 text-sm font-medium text-[color:var(--on-error-container)] ' + className}
        >
            {message}
        </p>
    ) : null;
}
