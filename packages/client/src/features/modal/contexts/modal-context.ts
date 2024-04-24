import { createContext, useContext } from "react"

export const ModalContext = createContext<{
    onClose: () => void
    isOpenedAnimation: boolean
} | null>(null)

export const useModal = () => useContext(ModalContext)
