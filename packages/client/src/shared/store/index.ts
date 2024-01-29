import { atom } from "recoil"

export const vkSignDataState = atom<object | null>({
    key: "VKSignData",
    default: null,
})
