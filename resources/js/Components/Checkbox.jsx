export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={'h-4 w-4 rounded border-0 bg-[color:var(--surface-container-highest)] text-[color:var(--primary)] focus:ring-[color:rgba(0,64,161,0.18)] ' + className}
        />
    );
}
