import { ModalPageHeader, PanelHeaderBack, PanelHeaderClose } from "@vkontakte/vkui"
import { ReactNode } from "react"
import { ModalBody } from "./modal-body"
import { ModalWrapper } from "./modal-wrapper"

type ModalWindowProps = {
    isOpened: boolean
    children: ReactNode
    title?: ReactNode | string
    buttonType?: "close" | "back"
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
    buttonType,
    ...props
}: ModalWindowProps) => {
    const onClose = () => {}

    return (
        <ModalWrapper isOpened={isOpened} onClose={props.onClose || props.close}>
            <ModalBody fullwidth={true} fullscreen={true}>
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
                    />
                )}
                {children}
            </ModalBody>
        </ModalWrapper>
    )
}
