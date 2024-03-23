import {
    Icon28Cards2Outline,
    Icon28HieroglyphCharacterOutline,
    Icon28HomeOutline,
    Icon28PlayCircle,
    Icon28UserCircleOutline,
} from "@vkontakte/icons"

export const tabs = [
    {
        label: "Главная",
        icon: Icon28HomeOutline,
        view: "main",
        url: "/",
    },
    {
        label: "Стопки",
        icon: Icon28Cards2Outline,
        view: "stacks",
        url: "/stacks",
    },
    {
        label: "Играть",
        icon: Icon28PlayCircle,
        view: "play",
        url: "/play",
    },
    {
        label: "Новое",
        icon: Icon28HieroglyphCharacterOutline,
        view: "new",
        url: "/new",
    },
    {
        label: "Профиль",
        icon: Icon28UserCircleOutline,
        view: "profile",
        url: "/profile",
    },
]
