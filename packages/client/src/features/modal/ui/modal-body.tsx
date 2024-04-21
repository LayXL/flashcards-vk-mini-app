import { AdaptivityProvider } from "@vkontakte/vkui"
import { ReactNode, useEffect, useId, useMemo } from "react"
import { useRecoilState } from "recoil"
import { cn } from "../../../shared/helpers/cn"
import { modalsIdsState } from "../../../shared/store"

type ModalBodyProps = {
    children: ReactNode
    fullscreen?: boolean
    fullwidth?: boolean
}

export const ModalBody = ({ children, fullscreen = false, fullwidth = false }: ModalBodyProps) => {
    const id = useId()

    const [ids, setIds] = useRecoilState(modalsIdsState)

    useEffect(() => {
        setIds((prev) => [...prev, id])

        return () => {
            setIds((prev) => prev.filter((modalId) => modalId !== id))
        }
    }, [id, setIds])

    const depth = useMemo(() => ids.length - ids.findIndex((modalId) => modalId === id), [id, ids])

    return (
        <AdaptivityProvider viewWidth={2}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    "relative flex-col",
                    "overflow-auto",
                    "overscroll-contain",
                    "w-full",
                    "pb-safe-area-bottom mx-auto mt-safe-area-top",
                    fullscreen && "h-screen",
                    !fullwidth && "max-w-[540px]",
                    depth > 3 && "invisible"
                )}
            >
                <div className={"rounded-t-2xl bg-vk-content h-full"} children={children} />
            </div>
        </AdaptivityProvider>
    )
}
