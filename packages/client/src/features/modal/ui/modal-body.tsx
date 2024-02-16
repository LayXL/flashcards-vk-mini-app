import styled from "styled-components"
import { ReactNode } from "react"
import { motion } from "framer-motion"

type ModalBodyProps = {
    children: ReactNode
    fullscreen?: boolean
}

export const ModalBody = ({ children, fullscreen = false }: ModalBodyProps) => {
    return (
        <Body
            $fullscreen={fullscreen}
            onClick={(e) => {
                e.stopPropagation()
            }}
            initial={{ translateY: "100%" }}
            animate={{ translateY: 0 }}
            exit={{ translateY: "100%" }}
            transition={{
                duration: 0.3,
                type: "spring",
                bounce: false,
            }}
        >
            {children}
        </Body>
    )
}

const Body = styled(motion.div)<{ $fullscreen: boolean }>`
    display: flex;
    bottom: 0;
    position: relative;
    flex-direction: column;
    border-radius: 16px 16px 0 0;
    max-height: 100vh;
    overflow: scroll;
    overscroll-behavior: contain;
    background-color: var(--vkui--color_background_content);
    padding-bottom: env(safe-area-inset-bottom);
    margin-top: env(safe-area-inset-top);
    height: ${(props) => props.$fullscreen && "100vh"};
`
