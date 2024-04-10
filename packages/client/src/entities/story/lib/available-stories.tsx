import { ReactNode } from "react"

type Story = {
    name: string
    title: string
    content: ReactNode
}

export const availableStories = [
    {
        name: "hello-world",
        title: "Привет, мир!",
        content: (
            <div className={"bg-[#0077FF] flex items-center justify-center"}>
                <span className={"text-2xl font-medium bg-white text-black px-2 py-1 rounded-2xl"}>
                    Это первая история*
                </span>
                <span className={"text-base font-thin absolute bottom-4 right-4"}>
                    *в приложении
                </span>
            </div>
        ),
    },
]
