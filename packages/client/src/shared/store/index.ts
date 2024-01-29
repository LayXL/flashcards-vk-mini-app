import { atom } from "recoil"

export const vkSignDataAtom = atom<object | null>({
    key: "VKSignDataAtom",
    default: null,
})
