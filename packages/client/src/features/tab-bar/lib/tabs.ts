import {
    Icon24Home,
    Icon28AllCategoriesOutline,
    Icon24Play,
    Icon28Profile,
    Icon24Fire,
    Icon28Cards2,
} from "@vkontakte/icons"

export const tabs = [
    {
        label: "Главная",
        icon: Icon24Home,
        view: "main",
        url: "/",
    },
    {
        label: "Стопки",
        icon: Icon28Cards2,
        view: "stacks",
        url: "/stacks",
    },
    {
        label: "Играть",
        icon: Icon24Play,
        view: "play",
        url: "/play",
    },
    {
        label: "Новое",
        icon: Icon24Fire,
        view: "new",
        url: "/new",
    },
    {
        label: "Профиль",
        icon: Icon28Profile,
        view: "profile",
        url: "/profile",
    },
]
