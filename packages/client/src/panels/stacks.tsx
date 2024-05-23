import {
    CardScroll,
    Div,
    Group,
    Header,
    Link,
    ModalPageHeader,
    PanelHeader,
    PanelHeaderBack,
    Spacing,
} from "@vkontakte/vkui"
import { useState } from "react"
import { StackCard } from "../entities/stack/ui/stack-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { SearchBar } from "../features/search/ui/search-bar"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { NotFoundCollection } from "../widgets/not-found-collection"
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
            <PanelHeader children={"Коллекции"} />

            <SearchBar />

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
                        <div className={"flex gap-3 [&>*]:max-w-[160px]"}>
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

            {data && <NotFoundCollection />}

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

            <TabBar />
        </>
    )
}
