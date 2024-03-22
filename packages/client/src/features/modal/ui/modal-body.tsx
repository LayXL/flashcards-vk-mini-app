import { ReactNode, useEffect } from "react"
import { useRecoilState } from "recoil"
import { useScrollLock } from "usehooks-ts"
import { cn } from "../../../shared/helpers/cn"
import { modalsCountAtom } from "../../../shared/store"

type ModalBodyProps = {
    children: ReactNode
    fullscreen?: boolean
}

export const ModalBody = ({ children, fullscreen = false }: ModalBodyProps) => {
    const { lock, unlock } = useScrollLock()

    const [, setModalsCount] = useRecoilState(modalsCountAtom)

    useEffect(() => {
        setModalsCount((prev) => prev + 1)
        lock()

        return () => {
            setModalsCount((prev) => {
                if (prev - 1 === 0) unlock()

                return prev - 1
            })
        }
    }, [])

    return (
        <div
            onClick={(e) => {
                e.stopPropagation()
            }}
            className={cn(
                "relative flex-col bottom-0",
                "overflow-scroll overscroll-none",
                "rounded-t-2xl bg-vk-content",
                "max-h-screen max-w-[480px] w-full",
                "pb-[env(safe-area-inset-bottom)] mx-auto mt-[env(safe-area-inset-top)]",
                fullscreen && "h-screen"
            )}
            children={children}
        />
    )
}
