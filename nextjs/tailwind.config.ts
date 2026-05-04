import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: "var(--font-sans)",
                heading: "var(--font-heading)",
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                card: "var(--card)",
                "card-foreground": "var(--card-foreground)",
                popover: "var(--popover)",
                "popover-foreground": "var(--popover-foreground)",

                primary: "var(--primary)",
                "primary-foreground": "var(--primary-foreground)",
                "primary-container": "var(--primary-container)",
                "on-primary-container": "var(--on-primary-container)",

                secondary: "var(--secondary)",
                "secondary-foreground": "var(--secondary-foreground)",
                "secondary-container": "var(--secondary-container)",
                "on-secondary-container": "var(--on-secondary-container)",

                tertiary: "var(--tertiary)",
                "tertiary-container": "var(--tertiary-container)",
                "on-tertiary": "var(--on-tertiary)",
                "on-tertiary-container": "var(--on-tertiary-container)",

                muted: "var(--muted)",
                "muted-foreground": "var(--muted-foreground)",

                accent: "var(--accent)",
                "accent-foreground": "var(--accent-foreground)",

                destructive: "var(--error)",

                "error-container": "var(--error-container)",
                "on-error-container": "var(--on-error-container)",
                "success-container": "var(--success-container)",
                "on-success-container": "var(--on-success-container)",

                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                "outline-variant": "var(--outline-variant)",

                "surface-bright": "var(--surface-bright)",
                "surface-container-lowest": "var(--surface-container-lowest)",
                "surface-container-low": "var(--surface-container-low)",
                "surface-container": "var(--surface-container)",
                "surface-container-high": "var(--surface-container-high)",
                "surface-dim": "var(--surface-dim)",
                "on-surface": "var(--on-surface)",
                "on-surface-variant": "var(--on-surface-variant)",
            },
            borderRadius: {
                xs: "0.25rem",
                sm: "0.5rem",
                md: "0.75rem",
                lg: "1rem",
                xl: "1.25rem",
                "2xl": "1.5rem",
                full: "9999px",
            },
            boxShadow: {
                xs: "0 1px 3px rgba(42, 52, 57, 0.08)",
                sm: "0 2px 6px rgba(42, 52, 57, 0.12)",
                base: "0 4px 12px rgba(42, 52, 57, 0.15)",
                md: "0 8px 24px -4px rgba(42, 52, 57, 0.06)",
                lg: "0 12px 32px rgba(42, 52, 57, 0.15)",
                xl: "0 20px 40px rgba(42, 52, 57, 0.20)",
                "2xl": "0 25px 50px rgba(42, 52, 57, 0.25)",
                "3xl": "0 35px 60px rgba(42, 52, 57, 0.30)",
                none: "none",
            },
            spacing: {
                "1.5": "0.5rem",
                "2.5": "0.7rem",
                3: "1rem",
            },
            fontSize: {
                "display-lg": ["3.5rem", { lineHeight: "1.1", fontWeight: "700" }],
                "display-md": ["2.8rem", { lineHeight: "1.2", fontWeight: "700" }],
                "display-sm": ["2.2rem", { lineHeight: "1.3", fontWeight: "700" }],

                "headline-lg": ["2rem", { lineHeight: "1.4", fontWeight: "600" }],
                "headline-md": ["1.75rem", { lineHeight: "1.4", fontWeight: "600" }],
                "headline-sm": ["1.5rem", { lineHeight: "1.5", fontWeight: "600" }],

                "title-lg": ["1.375rem", { lineHeight: "1.5", fontWeight: "700" }],
                "title-md": ["1rem", { lineHeight: "1.5", fontWeight: "700" }],
                "title-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "700" }],

                "body-lg": ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
                "body-md": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
                "body-sm": ["0.75rem", { lineHeight: "1.5", fontWeight: "400" }],

                "label-lg": ["0.875rem", { lineHeight: "1.25", fontWeight: "500" }],
                "label-md": ["0.75rem", { lineHeight: "1.25", fontWeight: "600" }],
                "label-sm": ["0.625rem", { lineHeight: "1.25", fontWeight: "600" }],
            },
        },
    },
    plugins: [],
} satisfies Config;
