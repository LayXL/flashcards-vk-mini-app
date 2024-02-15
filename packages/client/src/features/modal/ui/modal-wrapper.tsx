import styled from "styled-components"
import { FloatingPortal } from "@floating-ui/react"
import { ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ModalContext } from "../contexts/modal-context"

type ModalWrapperProps = {
    isOpened: boolean
    onClose: () => void
    children: ReactNode
}

export const ModalWrapper = ({ isOpened, children, onClose }: ModalWrapperProps) => {
    return (
        <ModalContext.Provider value={{ onClose }}>
            <AnimatePresence
                children={
                    isOpened && (
                        <FloatingPortal>
                            <Wrapper
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onClose()
                                }}
                                children={children}
                                initial={{ backgroundColor: "#00000000" }}
                                animate={{ backgroundColor: "#00000040" }}
                                exit={{ backgroundColor: "#00000000" }}
                            />
                        </FloatingPortal>
                    )
                }
            />
        </ModalContext.Provider>
    )
}

const Wrapper = styled(motion.div)`
    position: fixed;
    inset: 0;
    height: var(--tg-viewport-height);
    background-color: #00000040;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`
