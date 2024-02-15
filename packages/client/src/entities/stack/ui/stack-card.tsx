import { Card } from "@vkontakte/vkui"
import { ModalBody } from "../../../features/modal/ui/modal-body"
import { ModalWrapper } from "../../../features/modal/ui/modal-wrapper"
import { StackView } from "../../../widgets/stack-view"
import { useState } from "react"

type StackCardProps = {
    id: number
    name: string
}

export const StackCard = ({ id, name }: StackCardProps) => {
    const [isOpened, setIsOpened] = useState(false)

    return (
        <>
            <Card style={{ padding: 16 }} onClick={() => setIsOpened(true)}>
                {name}
            </Card>
            <ModalWrapper isOpened={isOpened} onClose={() => setIsOpened(false)}>
                <ModalBody fullscreen={true}>
                    <StackView id={id} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
