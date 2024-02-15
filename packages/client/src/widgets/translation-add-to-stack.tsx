import { Button, Div, PanelHeader, PanelHeaderClose } from "@vkontakte/vkui"
import { trpc } from "../shared/api"
import { StackCard } from "../entities/stack/ui/stack-card"
import { useCallback } from "react"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { ModalBody } from "../features/modal/ui/modal-body"
import { StackCreateModal } from "./stack-create"
import { useModalState } from "../shared/hooks/useModalState"

type TranslationAddToStackProps = {
    translationId: number
    onClose: () => void
}

export const TranslationAddToStack = ({ translationId, onClose }: TranslationAddToStackProps) => {
    const { isOpened, close, open } = useModalState()

    const { data } = trpc.stacks.getUserStacks.useQuery()

    const { mutate: addTranslationToStack } = trpc.stacks.addTranslation.useMutation()

    const onClickStack = useCallback(
        (stackId: number) => () => {
            addTranslationToStack({
                stackId,
                translationId,
            })
        },
        [addTranslationToStack, translationId],
    )

    return (
        <>
            <PanelHeader
                before={<PanelHeaderClose onClick={onClose} />}
                children={"Выберите стопку"}
            />

            <Div>
                <Button stretched={true} size={"l"} children={"Создать новую"} onClick={open} />
            </Div>

            <Div>
                {data?.map((stack) => (
                    <StackCard name={stack.name} onClick={onClickStack(stack.id)} />
                ))}
            </Div>

            <ModalWrapper isOpened={isOpened} onClose={close}>
                <ModalBody>
                    <StackCreateModal />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
