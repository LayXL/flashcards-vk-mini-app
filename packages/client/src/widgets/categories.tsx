import { Icon24AddOutline, Icon28HieroglyphCharacterOutline } from "@vkontakte/icons"
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import {
    Button,
    ButtonGroup,
    CardScroll,
    Div,
    Group,
    Header,
    Link,
    ModalPageHeader,
    PanelHeaderBack,
    Placeholder,
} from "@vkontakte/vkui"
import { useState } from "react"
import { StackCard } from "../entities/stack/ui/stack-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { PlayGame } from "./play-game"
import { StackView } from "./stack-view"

export const Categories = () => {
    const [selectedStackId, setSelectedStackId] = useState<number | null>(null)
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

    const { data } = trpc.categories.getMany.useQuery()
    const { data: selectedCategory } = trpc.categories.getSingle.useQuery(
        {
            id: selectedCategoryId ?? 0,
        },
        {
            enabled: !!selectedCategoryId,
        }
    )

    const stackViewModal = useModalState()
    const stackPlayModal = useModalState()
    const categoryViewModal = useModalState()

    const routeNavigator = useRouteNavigator()

    return (
        <>
            {data?.map((category) => (
                <Group key={category.id}>
                    <Header
                        children={category.name}
                        aside={
                            <Link
                                children={"Показать все"}
                                onClick={() => {
                                    setSelectedCategoryId(category.id)
                                    categoryViewModal.open()
                                }}
                            />
                        }
                    />
                    <CardScroll>
                        <div className={"flex gap-3 [&>*]:w-[160px]"}>
                            {category.stacks.map((stack) => (
                                <StackCard
                                    key={stack.id}
                                    title={stack.name}
                                    translationsCount={stack.translationsCount}
                                    isVerified={stack.isVerified}
                                    encodedBackground={stack.encodedBackground}
                                    onClick={() => {
                                        setSelectedStackId(stack.id)
                                        stackViewModal.open()
                                    }}
                                    onPlay={() => {
                                        setSelectedStackId(stack.id)
                                        stackPlayModal.open()
                                    }}
                                />
                            ))}
                        </div>
                    </CardScroll>
                </Group>
            ))}

            {data && (
                <Placeholder
                    icon={<Icon28HieroglyphCharacterOutline height={56} width={56} />}
                    header={"Не нашли подходящую коллекцию?"}
                    children={
                        "Вы можете найти коллекции от других пользователей или же создать собственные"
                    }
                    action={
                        <ButtonGroup mode={"vertical"} align={"center"}>
                            <Button
                                size={"l"}
                                children={"Перейти в ленту"}
                                onClick={() => routeNavigator.push("/new")}
                            />
                            <Button
                                size={"l"}
                                mode={"tertiary"}
                                children={"Создать свою коллекцию"}
                                before={<Icon24AddOutline />}
                                onClick={() => routeNavigator.push("/profile")}
                            />
                        </ButtonGroup>
                    }
                />
            )}

            <ModalWrapper isOpened={stackViewModal.isOpened} onClose={stackViewModal.close}>
                <ModalBody fullscreen>
                    {selectedStackId && <StackView id={selectedStackId} />}
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper isOpened={stackPlayModal.isOpened} onClose={stackPlayModal.close}>
                <ModalBody fullscreen>
                    {selectedStackId && (
                        <PlayGame stackId={selectedStackId} onClose={stackPlayModal.close} />
                    )}
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper isOpened={categoryViewModal.isOpened} onClose={categoryViewModal.close}>
                <ModalBody fullscreen>
                    <ModalPageHeader
                        before={<PanelHeaderBack onClick={categoryViewModal.close} />}
                        children={selectedCategory?.name}
                    />

                    <Div className={"grid grid-cols-cards gap-3 mb-safe-area-bottom"}>
                        {selectedCategory?.stacks.map((stack) => (
                            <StackCard
                                key={stack.id}
                                title={stack.name}
                                translationsCount={stack.translationsCount}
                                isVerified={stack.isVerified}
                                encodedBackground={stack.encodedBackground}
                                onClick={() => {
                                    setSelectedStackId(stack.id)
                                    stackViewModal.open()
                                }}
                                onPlay={() => {
                                    setSelectedStackId(stack.id)
                                    stackPlayModal.open()
                                }}
                            />
                        ))}
                    </Div>
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
