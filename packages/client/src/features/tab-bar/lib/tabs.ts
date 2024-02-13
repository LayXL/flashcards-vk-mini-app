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
        url: "/",
    },
    // {
    //     label: "Категории",
    //     icon: Icon28AllCategoriesOutline,
    //     view: "categories",
    //     url: "/",
    // },
    {
        label: "Играть",
        icon: Icon24Play,
        view: "play",
        url: "/play",
    },
    {
        label: "Для вас",
        icon: Icon24Fire,
        view: "forYou",
        url: "/forYou",
    },
    {
        label: "Профиль",
        icon: Icon28Profile,
        view: "profile",
        url: "/profile",
    },
]
