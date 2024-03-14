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
    selectedModifiers: ("time" | "attempts" | "repeat")[]
    gameDuration: number | null
    correctAnswerAddDuration: number | null
    attemptCount: number | null
}>({
    key: "gameSettings",
    default: {
        stacks: [],
        selectedModifiers: ["time"],
        gameDuration: null,
        correctAnswerAddDuration: null,
        attemptCount: null,
    },
})
