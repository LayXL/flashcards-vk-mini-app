import { atom } from "recoil"

export const vkSignDataState = atom<object | null>({
    key: "VKSignData",
    default: null,
})

export const modalsHistory = atom<string[]>({
    key: "modalsHistory",
    default: [],
})

// TODO: remove
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
        gameDuration: 60,
        correctAnswerAddDuration: 1,
        attemptCount: 3,
    },
})
