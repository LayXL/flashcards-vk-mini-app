import vkTheme from "@vkontakte/vkui-tokens/themes/vkBase/cssVars/theme"

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    corePlugins: {
        preflight: false,
    },
    theme: {
        extend: {
            padding: {
                "vertical-regular": "var(--vkui--size_base_padding_vertical--regular)",
                "horizontal-regular": "var(--vkui--size_base_padding_horizontal--regular)",
            },
            colors: {
                dynamic: {
                    red: vkTheme.colorAccentRed.normal.value,
                    green: vkTheme.colorAccentGreen.normal.value,
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
                cards: "repeat(auto-fill, minmax(160px, 1fr))",
            },
            transitionProperty: {
                height: "height",
                width: "width",
                size: "height, width",
            },
            animation: {
                "bg-appearing": "background-appearing 0.3s ease forwards",
                "bg-disappearing": "background-disappearing 0.3s ease",
                "content-appearing": "content-appearing 0.3s ease forwards",
                "content-disappearing": "content-disappearing 0.3s ease",
            },
        },
    },
    plugins: [],
}
