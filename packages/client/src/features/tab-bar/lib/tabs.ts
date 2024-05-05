import {
    Icon28GameOutline,
    Icon28HieroglyphCharacterOutline,
    Icon28UserCircleOutline,
} from "@vkontakte/icons"

export const tabs = [
    // {
    //     label: "Главная",
    //     icon: Icon28HomeOutline,
    //     view: "main",
    //     url: "/",
    // },
    // {
    //     label: "Коллекции",
    //     icon: Icon28Cards2Outline,
    //     view: "stacks",
    //     url: "/stacks",
    // },
    {
        label: "Новое",
        icon: Icon28HieroglyphCharacterOutline,
        view: "new",
        url: "/new",
    },
    {
        label: "Играть",
        icon: Icon28GameOutline,
        view: "play",
        url: "/play",
    },
    {
        label: "Профиль",
        icon: Icon28UserCircleOutline,
        view: "profile",
        url: "/profile",
    },
]
