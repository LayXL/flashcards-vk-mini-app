import { atom } from "recoil"

export const vkSignDataState = atom<object | null>({
    key: "VKSignData",
    default: null,
})

export const modalsIdsState = atom<Array<string>>({
    key: "modalsIds",
    default: [],
})
