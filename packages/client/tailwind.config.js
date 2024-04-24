import vkTheme from "@vkontakte/vkui-tokens/themes/vkBase/cssVars/theme"

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    corePlugins: {
        preflight: false,
    },
    theme: {
        extend: {
            spacing: {
                "safe-area-top": "env(safe-area-inset-top)",
                "safe-area-bottom": "env(safe-area-inset-bottom)",
            },
            height: {
                lh: "1lh",
            },
            padding: {
                "vertical-regular": "var(--vkui--size_base_padding_vertical--regular)",
                "horizontal-regular": "var(--vkui--size_base_padding_horizontal--regular)",
            },
            colors: {
                learning: {
                    red: "#FF3A72",
                },
                dynamic: {
                    red: vkTheme.colorAccentRed.normal.value,
                    green: vkTheme.colorAccentGreen.normal.value,
                    yellow: vkTheme.colorAccentOrange.normal.value,
                },
            },
            backgroundColor: {
                default: vkTheme.colorBackground.normal.value,
                contrast: vkTheme.colorBackgroundContrast.normal.value,
                secondary: vkTheme.colorBackgroundSecondary.normal.value,
                accent: vkTheme.colorBackgroundAccent.normal.value,
                accentThemed: vkTheme.colorBackgroundAccentThemed.normal.value,
                content: vkTheme.colorBackgroundContent.normal.value,
                modal: vkTheme.colorBackgroundModal.normal.value,
                vk: {
                    default: vkTheme.colorBackground.normal.value,
                    contrast: vkTheme.colorBackgroundContrast.normal.value,
                    secondary: vkTheme.colorBackgroundSecondary.normal.value,
                    accent: vkTheme.colorBackgroundAccent.normal.value,
                    accentThemed: vkTheme.colorBackgroundAccentThemed.normal.value,
                    content: vkTheme.colorBackgroundContent.normal.value,
                    modal: vkTheme.colorBackgroundModal.normal.value,
                },
            },
            borderColor: {
                vk: {
                    default: vkTheme.colorBackground.normal.value,
                    contrast: vkTheme.colorBackgroundContrast.normal.value,
                    secondary: vkTheme.colorBackgroundSecondary.normal.value,
                    accent: vkTheme.colorBackgroundAccent.normal.value,
                    accentThemed: vkTheme.colorBackgroundAccentThemed.normal.value,
                    content: vkTheme.colorBackgroundContent.normal.value,
                    modal: vkTheme.colorBackgroundModal.normal.value,
                },
            },
            textColor: {
                primary: vkTheme.colorTextPrimary.normal.value,
                secondary: vkTheme.colorTextSecondary.normal.value,
                subhead: vkTheme.colorTextSubhead.normal.value,
                tertiary: vkTheme.colorTextTertiary.normal.value,
                accent: vkTheme.colorTextAccent.normal.value,
                accentThemed: vkTheme.colorTextAccentThemed.normal.value,
                muted: vkTheme.colorTextMuted.normal.value,
            },
            boxShadow: {
                card: "0px 2px 24px 0px rgba(0, 0, 0, 0.08), 0px 0px 2px 0px rgba(0, 0, 0, 0.08);",
            },
            dropShadow: {
                card: "0px 2px 24px 0px rgba(0, 0, 0, 0.08), 0px 0px 2px 0px rgba(0, 0, 0, 0.08);",
            },
            gridTemplateColumns: {
                cards: "repeat(auto-fill, minmax(152px, 1fr))",
            },
            transitionProperty: {
                height: "height",
                width: "width",
                size: "height, width",
            },
            keyframes: {
                "fade-in": {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
                "slide-in": {
                    from: { transform: "translateY(100%)" },
                    to: { transform: "translateY(0)" },
                },
                spin: {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(360deg)" },
                },
            },
            animation: {
                "bg-appearing": "background-appearing 0.3s ease forwards",
                "bg-disappearing": "background-disappearing 0.3s ease",
                "content-appearing": "content-appearing 0.3s ease",
                "content-disappearing": "content-disappearing 0.3s ease forwards",
                "content-disappearing-gesture": "content-disappearing-gesture 0.3s ease forwards",
                "fade-in": "fade-in 0.3s ease",
                spin: "spin 1s linear infinite",
            },
            fontFamily: {
                "vk-sans": ["VKSans", "sans-serif"],
            },
        },
    },
    plugins: [],
}
