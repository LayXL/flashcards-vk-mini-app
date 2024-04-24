import { FloatingPortal } from "@floating-ui/react"
import { ReactNode, useEffect, useRef, useState } from "react"
import { cn } from "../../../shared/helpers/cn"
import { ModalContext } from "../contexts/modal-context"
import "./modal-keyframes.css"

type ModalWrapperProps = {
    isOpened: boolean
    onClose?: () => void
    close?: () => void
    children: ReactNode
}

export const ModalWrapper = ({ isOpened, children, ...props }: ModalWrapperProps) => {
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

    if (!isShowing) return null

    const close = props.close || props.onClose

    return (
        <ModalContext.Provider value={{ onClose: close!, isOpenedAnimation: isOpened }}>
            <FloatingPortal root={document.body}>
                <div
                    onClick={() => {
                        if ((document.getSelection()?.toString().length ?? 0) > 0) return

                        close?.()
                    }}
                    children={children}
                    className={cn(
                        "disable-scroll",
                        "fixed inset-0 flex-col justify-end",
                        isOpened && "animate-bg-appearing",
                        !isOpened && "animate-bg-disappearing"
                    )}
                />
            </FloatingPortal>
        </ModalContext.Provider>
    )
}
