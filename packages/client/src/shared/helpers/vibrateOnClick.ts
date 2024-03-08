import bridge from "@vkontakte/vk-bridge"

export const vibrateOnClick = () => bridge.send("VKWebAppTapticImpactOccurred", { style: "medium" })
