import {
    CardScroll,
    Div,
    Group,
    Header,
    Headline,
    Link,
    ModalPageHeader,
    PanelHeader,
    PanelHeaderBack,
    Spacing,
    Subhead,
} from "@vkontakte/vkui"
import { useState } from "react"
import { LargeStackCard } from "../entities/stack/ui/large-stack-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { PlayGame } from "../widgets/play-game"
import { StackView } from "../widgets/stack-view"

export const Stacks = () => {
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

    return (
        <>
            <PanelHeader children={"Стопки"} />

            <div className={"grid md:grid-cols-2 gap-x-3"}>
                {data?.map((category) => (
                    <div>
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
                                <div className={"flex gap-3"}>
                                    {category.stacks.map((stack) => (
                                        <LargeStackCard
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
                    </div>
                ))}
            </div>

            {data && (
                <Div>
                    <div className={"bg-vk-secondary rounded-xl p-3 flex-col gap-2"}>
                        <Headline weight={"2"} children={"Не нашли подходящую стопку?"} />
                        {/* TODO: add links */}
                        <Subhead>
                            Вы можете найти стопки от других пользователей или же создать
                            собственные
                        </Subhead>
                    </div>
                </Div>
            )}

            <Spacing size={256} />

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

                    <Div className={"grid grid-cols-cards gap-3"}>
                        {selectedCategory?.stacks.map((stack) => (
                            <LargeStackCard
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

            <TabBar />
        </>
    )
}
