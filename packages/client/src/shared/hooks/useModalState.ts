import { useState } from "react"

export const useModalState = (
    defaultState: boolean = false,
    { onClose }: { onClose?: () => void } = {}
) => {
    const [isOpened, setIsOpened] = useState(defaultState)

    return {
        isOpened,
        setIsOpened,
        close: () => {
            onClose?.()
            setIsOpened(false)
        },
        open: () => setIsOpened(true),
    }
}
