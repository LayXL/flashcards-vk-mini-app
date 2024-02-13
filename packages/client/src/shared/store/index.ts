import { atom } from "recoil"

export const vkSignDataState = atom<object | null>({
    key: "VKSignData",
    default: null,
})

export const modalsHistory = atom<string[]>({
    key: "modalsHistory",
    default: [],
})

export const newTranslation = atom<{
    languageId?: number
    languageVariationId?: number | null
    vernacular: string
    foreign: string
    tags: string[]
    transcriptions: {
        id: number
        languageVariationId?: number | null
        transcription: string | null
    }[]
}>({
    key: "newTranslation",
    default: {
        languageId: 1, // todo fix
        languageVariationId: null,
        vernacular: "",
        foreign: "",
        tags: [],
        transcriptions: [
            {
                id: 0,
                transcription: null,
                languageVariationId: null,
            },
        ],
    },
})
