export const getSuitableAvatarUrl = (avatarUrls: unknown = {}, preferredSize: number = 100) => {
    if (avatarUrls === null || avatarUrls === undefined) {
        return undefined
    }

    const entries = Object.entries(avatarUrls as Record<number | "max", string>)

    const preferredAvatar = entries.find(
        ([size]) => typeof size === "number" && size >= preferredSize
    )

    try {
        return !preferredAvatar ? entries[entries.length - 1][1] : preferredAvatar[1]
    } catch {
        return undefined
    }
}
