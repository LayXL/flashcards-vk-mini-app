import {
    Icon24Home,
    Icon28AllCategoriesOutline,
    Icon24Play,
    Icon28Profile,
    Icon24Fire,
} from "@vkontakte/icons"

export const tabs = [
    {
        label: "Главная",
        icon: Icon24Home,
        view: "main",
    },
    {
        label: "Категории",
        icon: Icon28AllCategoriesOutline,
        view: "categories",
    },
    {
        label: "Играть",
        icon: Icon24Play,
        view: "play",
    },
    {
        label: "Для вас",
        icon: Icon24Fire,
        view: "forYou",
    },
    {
        label: "Профиль",
        icon: Icon28Profile,
        view: "profile",
    },
]
