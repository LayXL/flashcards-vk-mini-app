import { createContext, useContext } from "react"

export const ModalContext = createContext<{ onClose: () => void } | null>(null)

export const useModal = () => useContext(ModalContext)
