import { FloatingPortal } from "@floating-ui/react"
import { ReactNode, useEffect, useRef, useState } from "react"
import { cn } from "../../../shared/helpers/cn"
import { ModalContext } from "../contexts/modal-context"
import "./modal-keyframes.css"

type ModalWrapperProps = {
    isOpened: boolean
    onClose: () => void
    children: ReactNode
}

export const ModalWrapper = ({ isOpened, children, onClose }: ModalWrapperProps) => {
    const [isShowing, setIsShowing] = useState(isOpened)

    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (isOpened) {
            setIsShowing(true)

            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        } else {
            timeoutRef.current = setTimeout(() => setIsShowing(false), 300)
        }
    }, [isOpened])

    useEffect(
        () => () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        },
        []
    )

    return (
        isShowing && (
            <ModalContext.Provider value={{ onClose }}>
                <FloatingPortal>
                    <div
                        onClick={(e) => {
                            e.stopPropagation()
                            onClose()
                        }}
                        children={children}
                        className={cn(
                            "fixed inset-0 h-screen flex-col justify-end",
                            isOpened && "animate-bg-appearing [&>div]:animate-content-appearing",
                            !isOpened &&
                                "animate-bg-disappearing [&>div]:animate-content-disappearing"
                        )}
                    />
                </FloatingPortal>
            </ModalContext.Provider>
        )
    )
}
