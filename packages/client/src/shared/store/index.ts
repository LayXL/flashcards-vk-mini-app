import { atom } from "recoil"

export const vkSignDataState = atom<object | null>({
    key: "VKSignData",
    default: null,
})

export const modalsCountAtom = atom<number>({
    key: "VKSignData",
    default: 0,
})
