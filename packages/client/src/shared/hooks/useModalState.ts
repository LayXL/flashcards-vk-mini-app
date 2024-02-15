import { useState } from "react"

export const useModalState = (defaultState: boolean = false) => {
    const [isOpened, setIsOpened] = useState(defaultState)

    return {
        isOpened,
        setIsOpened,
        close: () => setIsOpened(false),
        open: () => setIsOpened(true),
    }
}
