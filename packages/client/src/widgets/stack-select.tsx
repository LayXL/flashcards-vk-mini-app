import { Icon24Add } from "@vkontakte/icons"
import { Button, ButtonGroup, Div, Group, ModalPageHeader, PanelHeaderBack } from "@vkontakte/vkui"
import { LargeStackCard } from "../entities/stack/ui/large-stack-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { RouterInput, trpc } from "../shared/api"
import { useEncodeStackBackground } from "../shared/helpers/stackBackground"
import { useModalState } from "../shared/hooks/useModalState"
import { StackCreateModal } from "./stack-create"

type StackSelectProps = {
    title?: string
    onSelect: (id: number) => void
    onClear?: () => void
    onClose: () => void
    canCreateNewStack: boolean
    filter?: RouterInput["stacks"]["getUserStacks"]["filter"]
    clearable?: boolean
}

export const StackSelect = ({
    title,
    onClose,
    onSelect,
    canCreateNewStack,
    filter,
    clearable,
    onClear,
}: StackSelectProps) => {
    const { data } = trpc.stacks.getUserStacks.useQuery({ filter })

    const createNewStack = useModalState()

    const encodeStackBackground = useEncodeStackBackground()

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderBack onClick={onClose} />}
                children={title || "Выберите стопку"}
            />

            {(clearable || canCreateNewStack) && (
                <Group>
                    <Div>
                        <ButtonGroup stretched={true}>
                            {clearable && (
                                <Button size={"l"} children={"Убрать выбор"} onClick={onClear} />
                            )}
                            {canCreateNewStack && (
                                <Button
                                    stretched={true}
                                    size={"l"}
                                    before={<Icon24Add />}
                                    children={"Создать новую"}
                                    onClick={createNewStack.open}
                                />
                            )}
                        </ButtonGroup>
                    </Div>
                </Group>
            )}

            {/* TODO infinite scroll */}

            <Group>
                <Div className={"gap-3 grid grid-cols-cards"}>
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
            </Group>

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
