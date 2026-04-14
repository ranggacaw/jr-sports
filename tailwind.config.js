import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                primary: 'var(--primary)',
                'primary-container': 'var(--primary-container)',
                'on-primary': 'var(--on-primary)',
                tertiary: 'var(--tertiary)',
                'tertiary-container': 'var(--tertiary-container)',
                surface: 'var(--surface)',
                'surface-container-lowest': 'var(--surface-container-lowest)',
                'surface-container-low': 'var(--surface-container-low)',
                'surface-container-high': 'var(--surface-container-high)',
                'surface-container-highest': 'var(--surface-container-highest)',
                'surface-bright': 'var(--surface-bright)',
                'on-surface': 'var(--on-surface)',
                'outline-variant': 'var(--outline-variant)',
                'error-container': 'var(--error-container)',
                'on-error-container': 'var(--on-error-container)',
                'secondary-container': 'var(--secondary-container)',
                'on-secondary-container': 'var(--on-secondary-container)',
                'secondary-fixed': 'var(--secondary-fixed)',
            },
            fontFamily: {
                sans: ['Manrope', ...defaultTheme.fontFamily.sans],
                headline: ['Lexend', ...defaultTheme.fontFamily.sans],
                label: ['Manrope', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
