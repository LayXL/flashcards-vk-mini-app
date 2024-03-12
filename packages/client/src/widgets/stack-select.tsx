import { Icon24Add } from "@vkontakte/icons"
import { Button, Div, ModalPageHeader, PanelHeaderBack } from "@vkontakte/vkui"
import { LargeStackCard } from "../entities/stack/ui/large-stack-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { RouterInput, trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { StackCreateModal } from "./stack-create"
import { useEncodeStackBackground } from "../shared/helpers/stackBackground"

type StackSelectProps = {
    onSelect: (id: number) => void
    onClose: () => void
    canCreateNewStack: boolean
    filter?: RouterInput["stacks"]["getUserStacks"]["filter"]
}

export const StackSelect = ({ onClose, onSelect, canCreateNewStack, filter }: StackSelectProps) => {
    const { data } = trpc.stacks.getUserStacks.useQuery({ filter })

    const createNewStack = useModalState()

    const encodeStackBackground = useEncodeStackBackground()

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderBack onClick={onClose} />}
                children="Выберите стопку"
            />

            {canCreateNewStack && (
                <Div>
                    <Button
                        stretched={true}
                        size={"l"}
                        before={<Icon24Add />}
                        children={"Создать новую"}
                        onClick={createNewStack.open}
                    />
                </Div>
            )}

            {/* TODO infinite scroll */}

            <Div className="gap-3 grid grid-cols-cards">
                {data?.items.map((stack) => (
                    // TODO redesign
                    <LargeStackCard
                        key={stack.id}
                        title={stack.name}
                        // TODO image and verified
                        onClick={() => onSelect(stack.id)}
                        translationsCount={stack.translationsCount}
                        isVerified={stack.isVerified}
                        encodedBackground={encodeStackBackground(stack)}
                    />
                ))}
            </Div>

            {canCreateNewStack && (
                <ModalWrapper isOpened={createNewStack.isOpened} onClose={createNewStack.close}>
                    <ModalBody>
                        <StackCreateModal />
                    </ModalBody>
                </ModalWrapper>
            )}
        </>
    )
}
