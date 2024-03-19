import bridge from "@vkontakte/vk-bridge"

export const getStorageValue = async (key: string) => {
    return (
        await bridge.send("VKWebAppStorageGet", {
            keys: [key],
        })
    ).keys[0].value
}
