import { Icon24Add, Icon28LikeOutline, Icon32Cards2Outline } from "@vkontakte/icons"
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import {
    Button,
    ButtonGroup,
    Div,
    Group,
    ModalPageHeader,
    PanelHeaderBack,
    Placeholder,
} from "@vkontakte/vkui"
import { useId } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { LargeStackCard } from "../entities/stack/ui/large-stack-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { RouterInput, trpc } from "../shared/api"
import useInfiniteList from "../shared/hooks/useInfiniteList"
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
    const id = useId()

    const { data, fetchNextPage, hasNextPage, isSuccess } =
        trpc.stacks.getUserStacks.useInfiniteQuery(
            { filter },
            {
                getNextPageParam: (lastPage) => lastPage.cursor,
            }
        )

    const inifiniteData = useInfiniteList(data)

    const routeNavigator = useRouteNavigator()

    const createNewStack = useModalState()

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderBack onClick={onClose} />}
                children={title || "Выберите коллекцию"}
            />

            {(clearable || canCreateNewStack || onFavorite) && (
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
                            {onFavorite && (
                                <Button
                                    stretched={true}
                                    size={"l"}
                                    before={<Icon28LikeOutline />}
                                    children={"В избранное"}
                                    onClick={onFavorite}
                                />
                            )}
                        </ButtonGroup>
                    </Div>
                </Group>
            )}

            <Div className={"h-full overflow-y-scroll overscroll-contain"} id={id}>
                {inifiniteData?.length === 0 && isSuccess ? (
                    <Placeholder
                        stretched
                        icon={<Icon32Cards2Outline height={56} width={56} />}
                        header={"Нет стопок для выбора"}
                        children={"Вы можете найти их в ленте"}
                        action={
                            <ButtonGroup mode={"vertical"} align={"center"}>
                                <Button
                                    stretched={true}
                                    size={"l"}
                                    children={"Найти коллекции"}
                                    onClick={() => {
                                        routeNavigator.push("/new")
                                    }}
                                />
                                {canCreateNewStack && (
                                    <Button
                                        stretched={true}
                                        size={"l"}
                                        mode={"secondary"}
                                        before={<Icon24Add />}
                                        children={"Создать коллекцию"}
                                        onClick={createNewStack.open}
                                    />
                                )}
                            </ButtonGroup>
                        }
                    />
                ) : (
                    <InfiniteScroll
                        scrollableTarget={id}
                        className={"gap-3 grid grid-cols-cards"}
                        next={fetchNextPage}
                        hasMore={hasNextPage}
                        loader={undefined}
                        dataLength={inifiniteData?.length ?? 0}
                    >
                        {inifiniteData?.map((stack) => (
                            <LargeStackCard
                                key={stack.id}
                                title={stack.name}
                                onClick={() => onSelect(stack.id)}
                                translationsCount={stack.translationsCount}
                                isVerified={stack.isVerified}
                                encodedBackground={stack.encodedBackground}
                            />
                        ))}
                    </InfiniteScroll>
                )}
            </Div>

            {canCreateNewStack && (
                <ModalWrapper isOpened={createNewStack.isOpened} onClose={createNewStack.close}>
                    <ModalBody>
                        <StackCreateModal onClose={createNewStack.close} />
                    </ModalBody>
                </ModalWrapper>
            )}
        </>
    )
}
