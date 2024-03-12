import { atom } from "recoil"

export const vkSignDataState = atom<object | null>({
    key: "VKSignData",
    default: null,
})

export const modalsHistory = atom<string[]>({
    key: "modalsHistory",
    default: [],
})

export const gameSettingsAtom = atom<{
    stacks: number[]
}>({
    key: "gameSettings",
    default: {
        stacks: [],
    },
})
