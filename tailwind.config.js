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
                nabla: ["Nabla"],
            },
            colors: {
                primary: "#4338CA",
                primarylight: "#554acf",
                secondary: "#2196F3",
                secondarylight: "#3da2f5",
                secondarydark: "#1976D2",
                graymedium: "#f8f9fa",
                graydark: "#dee2e6",
                vsdark: "#1e1e1e",
            },
            dropShadow: {
                nav: "0 20px 20px rgb(0, 0, 0, 0.05)",
            },
            backgroundImage: {
                form: "url('/src/assets/images/1920x1080_forms.jpg')",
            },
        },
    },
    plugins: [],
}
