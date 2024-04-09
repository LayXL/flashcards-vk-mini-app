import { Icon24Add, Icon28Like } from "@vkontakte/icons"
import {
    Button,
    ButtonGroup,
    Div,
    Group,
    ModalPageHeader,
    PanelHeaderBack,
    Title,
} from "@vkontakte/vkui"
import { LargeStackCard } from "../entities/stack/ui/large-stack-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { RouterInput, trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { StackCreateModal } from "./stack-create"

type StackSelectProps = {
    title?: string
    onSelect: (id: number) => void
    onClear?: () => void
    onClose: () => void
    onFavorite?: () => void
    canCreateNewStack: boolean
    filter?: RouterInput["stacks"]["getUserStacks"]["filter"]
    clearable?: boolean
}

export const StackSelect = ({
    title,
    onClose,
    onSelect,
    onFavorite,
    canCreateNewStack,
    filter,
    clearable,
    onClear,
}: StackSelectProps) => {
    const { data } = trpc.stacks.getUserStacks.useQuery({ filter })

    const createNewStack = useModalState()

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
                    {onFavorite && (
                        <div
                            className={
                                "bg-vk-secondary rounded-xl flex flex-col gap-2 items-center justify-center cursor-pointer"
                            }
                            onClick={onFavorite}
                        >
                            <Icon28Like />
                            <Title children={"Избранное"} level={"2"} />
                        </div>
                    )}
                    {data?.items.map((stack) => (
                        <LargeStackCard
                            key={stack.id}
                            title={stack.name}
                            onClick={() => onSelect(stack.id)}
                            translationsCount={stack.translationsCount}
                            isVerified={stack.isVerified}
                            encodedBackground={stack.encodedBackground}
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
