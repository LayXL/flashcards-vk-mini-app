import { Button, Div } from "@vkontakte/vkui"
import { useState } from "react"
import { StackCard } from "../entities/stack/ui/stack-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { StackCreateModal } from "./stack-create"
import { StackView } from "./stack-view"

export const UserStacks = () => {
    const { data } = trpc.stacks.getUserStacks.useQuery()

    const [isOpened, setIsOpened] = useState(false)

    return (
        <>
            <Div>
                <Button
                    stretched={true}
                    size={"l"}
                    children={"Добавить стопку"}
                    onClick={() => setIsOpened(true)}
                />
            </Div>

            <ModalWrapper isOpened={isOpened} onClose={() => setIsOpened(false)}>
                <ModalBody>
                    <StackCreateModal />
                </ModalBody>
            </ModalWrapper>

            <Div>
                {data?.map((stack) => (
                    <StackCardWithModal key={stack.id} id={stack.id} name={stack.name} />
                ))}
            </Div>
        </>
    )
}

type StackCardWithModalProps = {
    id: number
    name: string
}

const StackCardWithModal = ({ id, name }: StackCardWithModalProps) => {
    const { isOpened, open, close } = useModalState()

    return (
        <>
            <StackCard name={name} onClick={open} />

            <ModalWrapper isOpened={isOpened} onClose={close}>
                <ModalBody fullscreen={true}>
                    <StackView id={id} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
