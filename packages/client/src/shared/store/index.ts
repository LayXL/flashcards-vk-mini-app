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
    translationId?: number
    isEditing?: boolean
    languageId?: number
    languageVariationId?: number | null
    example?: string | null
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
        isEditing: false,
        languageId: 1, // todo fix
        languageVariationId: null,
        vernacular: "",
        foreign: "",
        example: "",
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
