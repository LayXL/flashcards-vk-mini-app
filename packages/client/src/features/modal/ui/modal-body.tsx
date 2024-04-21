import { AdaptivityProvider } from "@vkontakte/vkui"
import { motion, useDragControls } from "framer-motion"
import { ReactNode, useEffect, useId, useMemo, useState } from "react"
import { useRecoilState } from "recoil"
import { cn } from "../../../shared/helpers/cn"
import { modalsIdsState } from "../../../shared/store"
import { useModal } from "../contexts/modal-context"

type ModalBodyProps = {
    children: ReactNode
    fullscreen?: boolean
    fullwidth?: boolean
}

export const ModalBody = ({ children, fullscreen = false, fullwidth = false }: ModalBodyProps) => {
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

    const controls = useDragControls()

    const [clicked, setClicked] = useState(false)
    const [isTouchNone, setIsTouchNone] = useState(false)

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
                <motion.div
                    className={cn("rounded-t-2xl bg-vk-content", isTouchNone && "touch-none")}
                    children={children}
                    drag={"y"}
                    dragControls={controls}
                    dragListener={false}
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={{ top: 0, bottom: 0.5 }}
                    onPointerDown={(e) => {
                        setClicked(true)
                    }}
                    onPointerMove={(e) => {
                        if (!clicked) return

                        if (e.movementY < 0) {
                            e.preventDefault()
                            return setClicked(false)
                        } else if (e.movementY > 0) {
                            setIsTouchNone(true)

                            controls.start(e)
                            setClicked(false)
                        }
                    }}
                    onPointerUp={() => {
                        setIsTouchNone(false)
                    }}
                    onDragEnd={(e, { offset, velocity }) => {
                        console.log(offset)

                        if (offset.y > 100 || velocity.y > 100) {
                            modal?.onClose()
                        }
                    }}
                />
                {/* <div
                    className={cn(
                        "absolute top-0 left-0 right-0 h-32 bg-black/10 touch-none",
                        !clicked && "pointer-events-none"
                    )}
                /> */}
            </div>
        </AdaptivityProvider>
    )
}
