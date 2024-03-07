import { PanelHeader, Spinner } from "@vkontakte/vkui"
import { useCallback, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { LargeStackCard } from "../entities/stack/ui/large-stack-card"
import { FeedTranslationCard } from "../entities/translation/ui/feed-translation-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"
import useInfiniteList from "../shared/hooks/useInfiniteList"
import { useModalState } from "../shared/hooks/useModalState"
import { StackView } from "../widgets/stack-view"
import { TranslationView } from "../widgets/translation-view"

export const New = () => {
    const [selectedStack, setSelectedStack] = useState<number | null>(null)
    const stackViewModal = useModalState()

    const [selectedTranslation, setSelectedTranslation] = useState<number | null>(null)
    const translationViewModal = useModalState()

    const { data, fetchNextPage, hasNextPage } = trpc.feed.get.useInfiniteQuery(
        {},
        {
            getNextPageParam: ({ cursor }) => cursor,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
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

    const onClickTranslation = useCallback(
        (id: number) => () => {
            setSelectedTranslation(id)
            translationViewModal.open()
        },
        [translationViewModal],
    )

    return (
        <>
            <PanelHeader children={"Новое"} />

            <InfiniteScroll
                dataLength={infiniteData?.length ?? 0}
                hasMore={hasNextPage}
                next={fetchNextPage}
                loader={<Spinner className="py-12" />}
                className="pb-24 gap-3"
                style={{
                    display: "grid",
                    gridAutoRows: 100,
                    gridAutoFlow: "dense",
                    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                }}
            >
                {infiniteData?.map((x) =>
                    x.type === "stack" ? (
                        <div
                            style={{
                                gridRowEnd: "span 2",
                            }}
                        >
                            <LargeStackCard
                                key={x.stackData.id}
                                title={x.stackData.name}
                                translationsCount={x.stackData.translationsCount}
                                imageUrl={"/public/illustrations/artist.webp"}
                                onClick={onClickStack(x.stackData.id)}
                            />
                        </div>
                    ) : x.type === "translation" ? (
                        <div
                            style={{
                                gridRowEnd: "span 1",
                            }}
                        >
                            <FeedTranslationCard
                                key={x.translationData.id}
                                foreign={x.translationData.foreign}
                                vernacular={x.translationData.vernacular}
                                authorName={x.translationData.author.firstName ?? ""}
                                authorAvatarUrl={
                                    getSuitableAvatarUrl(x.translationData.author.avatarUrls, 32) ??
                                    ""
                                }
                                onAdd={() => {}}
                                onClick={onClickTranslation(x.translationData.id)}
                                onShowMore={() => {}}
                            />
                        </div>
                    ) : (
                        <></>
                    ),
                )}
            </InfiniteScroll>

            <ModalWrapper isOpened={stackViewModal.isOpened} onClose={stackViewModal.close}>
                <ModalBody fullscreen={true}>
                    {selectedStack && <StackView id={selectedStack} />}
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper
                isOpened={translationViewModal.isOpened}
                onClose={translationViewModal.close}
            >
                {selectedTranslation && (
                    <TranslationView
                        id={selectedTranslation}
                        onClose={translationViewModal.close}
                    />
                )}
            </ModalWrapper>

            <TabBar />
        </>
    )
}
