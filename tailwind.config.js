import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.vue',
        './src/**/*.js',
    ],
    darkMode: 'media',
    plugins: [forms],
};
