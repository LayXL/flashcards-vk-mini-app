import { VK } from "vk-io"

export const vkApi = new VK({
    token: process.env.SERVICE_SECRET,
    language: "ru",
})
