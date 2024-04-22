import { AdaptivityProvider } from "@vkontakte/vkui"
import { ReactNode, useEffect, useId, useMemo, useState } from "react"
import { useRecoilState } from "recoil"
import { cn } from "../../../shared/helpers/cn"
import { modalsIdsState } from "../../../shared/store"
import { useModal } from "../contexts/modal-context"

type ModalBodyProps = {
    children: ReactNode
    fullscreen?: boolean
    fullwidth?: boolean
    disableDragToClose?: boolean
}

export const ModalBody = ({
    children,
    fullscreen = false,
    fullwidth = false,
    disableDragToClose,
}: ModalBodyProps) => {
    const id = useId()

    const modal = useModal()

    const [ids, setIds] = useRecoilState(modalsIdsState)

    useEffect(() => {
        setIds((prev) => [...prev, id])

        return () => {
            setIds((prev) => prev.filter((modalId) => modalId !== id))
        }
    }, [id, setIds])

    const depth = useMemo(() => ids.length - ids.findIndex((modalId) => modalId === id), [id, ids])

    const [startY, setStartY] = useState(0)

    const [delta, setDelta] = useState(0)

    return (
        <AdaptivityProvider viewWidth={2}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    "relative",
                    "overflow-auto",
                    "overscroll-none",
                    "rounded-t-2xl bg-vk-content",
                    "pt-safe-area-top mx-auto w-full pb-safe-area-bottom",
                    fullscreen && "h-screen",
                    !fullwidth && "max-w-[540px]",
                    depth > 3 && "invisible"
                )}
                onTouchStart={
                    !disableDragToClose
                        ? (e) => {
                              setStartY(e.touches[0].clientY)
                          }
                        : undefined
                }
                onTouchMove={
                    !disableDragToClose
                        ? (e) => {
                              if (e.currentTarget.scrollTop !== 0) return

                              // e.currentTarget.scrollTo({ top: 0 })

                              const deltaY = e.touches[0].clientY - startY

                              setDelta(deltaY > 0 ? deltaY : 0)

                              if (deltaY > 128) modal?.onClose()
                          }
                        : undefined
                }
                onTouchEnd={
                    !disableDragToClose
                        ? () => {
                              setDelta(0)
                          }
                        : undefined
                }
            >
                <div
                    className={"h-full"}
                    children={children}
                    style={{
                        transform: `translateY(${delta}px)`,
                        touchAction: delta > 0 ? "none" : undefined,
                    }}
                />
            </div>
        </AdaptivityProvider>
    )
}
