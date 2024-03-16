import bridge from "@vkontakte/vk-bridge"

export const vibrateOnClick = () => bridge.send("VKWebAppTapticImpactOccurred", { style: "medium" })

export const vibrateOnSuccess = () =>
    bridge.send("VKWebAppTapticNotificationOccurred", { type: "success" })
