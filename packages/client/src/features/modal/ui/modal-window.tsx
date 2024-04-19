import { ModalPageHeader, PanelHeaderBack, PanelHeaderClose } from "@vkontakte/vkui"
import { ReactNode } from "react"
import { ModalBody } from "./modal-body"
import { ModalWrapper } from "./modal-wrapper"

type ModalWindowProps = {
    isOpened: boolean
    children: ReactNode
    title?: ReactNode | string
    buttonType?: "close" | "back" | "none"
    fullwidth?: boolean
    fullscreen?: boolean
    after?: ReactNode
} & (
    | {
          onClose: () => void
      }
    | {
          close: () => void
      }
)

export const ModalWindow = ({
    isOpened,
    children,
    title,
    buttonType = "close",
    fullwidth,
    fullscreen,
    after,
    ...props
}: ModalWindowProps) => {
    const onClose = "onClose" in props ? props.onClose : props.close

    return (
        <ModalWrapper isOpened={isOpened} onClose={onClose}>
            <ModalBody fullwidth={fullwidth} fullscreen={fullscreen}>
                {title && (
                    <ModalPageHeader
                        before={
                            buttonType === "back" ? (
                                <PanelHeaderBack onClick={onClose} />
                            ) : buttonType === "close" ? (
                                <PanelHeaderClose onClick={onClose} />
                            ) : undefined
                        }
                        children={title}
                        after={after}
                    />
                )}
                {children}
            </ModalBody>
        </ModalWrapper>
    )
}
