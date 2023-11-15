/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
        "./node_modules/primeicons/**/*.{js,ts,jsx,tsx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                "major-mono": ["Major Mono Display"],
            },
            colors: {
                primary: "#4338CA",
                secondary: "#2196F3",
                mediumgray: "#f8f9fa",
                darkgray: "#dee2e6"
            },
        },
    },
    plugins: [],
}