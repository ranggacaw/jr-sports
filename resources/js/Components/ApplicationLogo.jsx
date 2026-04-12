export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect x="6" y="6" width="52" height="52" rx="18" fill="currentColor" />
            <path
                d="M21 25h14c4.418 0 8 3.582 8 8s-3.582 8-8 8h-6v8"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M23 20v24"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
            />
            <circle cx="45" cy="20" r="5" fill="#6BFE9C" />
        </svg>
    );
}
