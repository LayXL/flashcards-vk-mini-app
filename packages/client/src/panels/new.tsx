import { PanelHeader, Spinner } from "@vkontakte/vkui"
import { useCallback, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { LargeStackCard } from "../entities/stack/ui/large-stack-card"
import { FeedTranslationCard } from "../entities/translation/ui/feed-translation-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import useInfiniteList from "../shared/hooks/useInfiniteList"
import { useModalState } from "../shared/hooks/useModalState"
import { StackView } from "../widgets/stack-view"

export const New = () => {
    const [selectedStack, setSelectedStack] = useState<number | null>(null)
    const stackViewModal = useModalState()

    const { data, fetchNextPage, hasNextPage } = trpc.feed.get.useInfiniteQuery(
        {},
        {
            getNextPageParam: ({ cursor }) => cursor,
        },
    )

    const infiniteData = useInfiniteList(data)

    const onClickStack = useCallback(
        (id: number) => () => {
            setSelectedStack(id)
            stackViewModal.open()
        },
        [stackViewModal],
    )

    return (
        <>
            <PanelHeader children={"Новое"} />

            <InfiniteScroll
                dataLength={infiniteData?.length ?? 0}
                hasMore={hasNextPage}
                next={() => {
                    fetchNextPage()
                }}
                loader={<Spinner className="pt-12 pb-24" />}
            >
                <ResponsiveMasonry
                    columnsCountBreakPoints={{
                        420: 2,
                        520: 3,
                        720: 4,
                        940: 5,
                        1020: 6,
                    }}
                >
                    <Masonry className="p-3" gutter="12px">
                        {infiniteData?.map((x) =>
                            x.type === "stack" ? (
                                <LargeStackCard
                                    key={x.stackData.id}
                                    title={x.stackData.name}
                                    translationsCount={0}
                                    imageUrl={"/public/illustrations/artist.webp"}
                                    onClick={onClickStack(x.stackData.id)}
                                />
                            ) : x.type === "translation" ? (
                                <FeedTranslationCard
                                    key={x.translationData.id}
                                    foreign={x.translationData.foreign}
                                    vernacular={x.translationData.vernacular}
                                    authorName="Trash"
                                    authorAvatarUrl="/public/illustrations/artist.webp"
                                    onAdd={() => {}}
                                    onClick={() => {}}
                                    onShowMore={() => {}}
                                />
                            ) : (
                                <></>
                            ),
                        )}
                    </Masonry>
                </ResponsiveMasonry>
            </InfiniteScroll>

            <ModalWrapper isOpened={stackViewModal.isOpened} onClose={stackViewModal.close}>
                <ModalBody fullscreen={true}>
                    {selectedStack && <StackView id={selectedStack} />}
                </ModalBody>
            </ModalWrapper>

            <TabBar />
        </>
    )
}
