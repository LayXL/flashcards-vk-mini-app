import { ReactNode } from "react"
import { useScrollLock } from "usehooks-ts"
import { cn } from "../../../shared/helpers/cn"

type ModalBodyProps = {
    children: ReactNode
    fullscreen?: boolean
    fullwidth?: boolean
}

export const ModalBody = ({ children, fullscreen = false, fullwidth = false }: ModalBodyProps) => {
    useScrollLock()

    return (
        <div
            onClick={(e) => {
                e.stopPropagation()
            }}
            className={cn(
                "relative flex-col bottom-0",
                "overflow-scroll overscroll-none",
                "rounded-t-2xl bg-vk-content",
                "max-h-screen w-full",
                "pb-[env(safe-area-inset-bottom)] mx-auto mt-[env(safe-area-inset-top)]",
                fullscreen && "h-screen",
                !fullwidth && "max-w-[480px]"
            )}
            children={children}
        />
    )
}
