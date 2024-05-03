import {
    Icon24Add,
    Icon24LikeOutline,
    Icon24UserOutline,
    Icon32Cards2Outline,
} from "@vkontakte/icons"
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import {
    Button,
    ButtonGroup,
    Div,
    Placeholder,
    SubnavigationBar,
    SubnavigationButton,
} from "@vkontakte/vkui"
import { useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { LargeStackCard } from "../entities/stack/ui/large-stack-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { RouterInput, trpc } from "../shared/api"
import { vibrateOnClick } from "../shared/helpers/vibrate"
import useInfiniteList from "../shared/hooks/useInfiniteList"
import { useModalState } from "../shared/hooks/useModalState"
import { CreateContent } from "./create-content"
import { StackView } from "./stack-view"

export const UserStacks = () => {
    const routeNavigator = useRouteNavigator()
    const [filter, setFilter] = useState<RouterInput["stacks"]["getUserStacks"]["filter"]>("all")

    const { data, isLoading, isSuccess, fetchNextPage, hasNextPage } =
        trpc.stacks.getUserStacks.useInfiniteQuery(
            {
                filter,
            },
            {
                getNextPageParam: (lastPage) => lastPage.cursor,
            }
        )

    const createStackModal = useModalState()

    const infiniteData = useInfiniteList(data)

    return (
        <>
            <SubnavigationBar>
                <SubnavigationButton
                    mode={"outline"}
                    before={<Icon24Add />}
                    children={"Создать"}
                    onClick={() => {
                        vibrateOnClick()
                        createStackModal.open()
                    }}
                />
                <SubnavigationButton
                    selected={filter === "saved"}
                    before={<Icon24LikeOutline />}
                    children={"Понравившиеся"}
                    onClick={() => {
                        vibrateOnClick()
                        setFilter(filter === "saved" ? "all" : "saved")
                    }}
                />
                <SubnavigationButton
                    selected={filter === "created"}
                    before={<Icon24UserOutline />}
                    children={"Созданные мной"}
                    onClick={() => {
                        vibrateOnClick()
                        setFilter(filter === "created" ? "all" : "created")
                    }}
                />
            </SubnavigationBar>

            <InfiniteScroll
                next={fetchNextPage}
                hasMore={hasNextPage}
                loader={<></>}
                dataLength={infiniteData?.length ?? 0}
            >
                <Div className={"grid grid-cols-cards gap-3 grid-flow-dense auto-rows-[212px]"}>
                    {isLoading &&
                        Array.from({ length: 20 }).map((_, i) => (
                            <div
                                key={i}
                                className={"w-full h-full animate-pulse bg-vk-secondary rounded-xl"}
                            />
                        ))}

                    {infiniteData?.map((stack) => (
                        <StackCardWithModal
                            key={stack.id}
                            id={stack.id}
                            name={stack.name}
                            translationsCount={stack.translationsCount}
                            isVerified={stack.isVerified}
                            encodedBackground={stack.encodedBackground}
                        />
                    ))}
                </Div>
            </InfiniteScroll>

            {isSuccess && infiniteData?.length === 0 && (
                <Placeholder
                    icon={<Icon32Cards2Outline width={56} height={56} />}
                    header={"У вас нет коллекций"}
                    children={"Создайте свою первую коллекцию"}
                    action={
                        <ButtonGroup mode={"vertical"} align={"center"}>
                            <Button
                                size={"l"}
                                mode={"secondary"}
                                children={"Создать коллекцию"}
                                onClick={createStackModal.open}
                            />
                            <Button
                                size={"l"}
                                mode={"tertiary"}
                                children={"Перейти в ленту"}
                                onClick={() => routeNavigator.push("/new")}
                            />
                        </ButtonGroup>
                    }
                />
            )}

            <CreateContent {...createStackModal} />
        </>
    )
}

type StackCardWithModalProps = {
    id: number
    name: string
    translationsCount: number
    isVerified?: boolean
    encodedBackground?: string
}

const StackCardWithModal = ({
    id,
    name,
    translationsCount,
    isVerified,
    encodedBackground,
}: StackCardWithModalProps) => {
    const { isOpened, open, close } = useModalState()

    return (
        <>
            <LargeStackCard
                title={name}
                translationsCount={translationsCount}
                onClick={() => {
                    vibrateOnClick()
                    open()
                }}
                isVerified={isVerified}
                // todo
                encodedBackground={encodedBackground}
            />

            <ModalWrapper isOpened={isOpened} onClose={close}>
                <ModalBody fullscreen={true}>
                    <StackView id={id} />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
