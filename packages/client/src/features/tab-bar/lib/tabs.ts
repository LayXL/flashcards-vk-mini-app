import { Icon24Fire, Icon24Home, Icon24Play, Icon28Cards2, Icon28Profile } from "@vkontakte/icons"

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
