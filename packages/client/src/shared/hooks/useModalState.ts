import { useState } from "react"

export const useModalState = (
    defaultState: boolean = false,
    { onClose, onOpen }: { onClose?: () => void; onOpen?: () => void } = {}
) => {
    const [isOpened, setIsOpened] = useState(defaultState)

    return {
        isOpened,
        setIsOpened,
        close: () => {
            onClose?.()
            setIsOpened(false)
        },
        open: () => {
            onOpen?.()
            setIsOpened(true)
        },
    }
}
