import { PanelHeader, Spacing, Spinner } from "@vkontakte/vkui"
import { useCallback, useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { LargeStackCard } from "../entities/stack/ui/large-stack-card"
import { FeedTranslationCard } from "../entities/translation/ui/feed-translation-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"
import { useEncodeStackBackground } from "../shared/helpers/stackBackground"
import { vibrateOnClick } from "../shared/helpers/vibrateOnClick"
import useInfiniteList from "../shared/hooks/useInfiniteList"
import { useIsScrollable } from "../shared/hooks/useIsScrollable"
import { useModalState } from "../shared/hooks/useModalState"
import { StackView } from "../widgets/stack-view"
import { TranslationAddToStack } from "../widgets/translation-add-to-stack"
import { TranslationView } from "../widgets/translation-view"

export const New = () => {
    const [selectedStack, setSelectedStack] = useState<number | null>(null)
    const stackViewModal = useModalState()

    const [selectedTranslation, setSelectedTranslation] = useState<number | null>(null)
    const translationViewModal = useModalState()
    const translationAddModal = useModalState()

    const { data, fetchNextPage, hasNextPage, isLoading } = trpc.feed.get.useInfiniteQuery(
        {},
        {
            getNextPageParam: ({ cursor }) => cursor,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        },
    )

    const encodeStackBackground = useEncodeStackBackground()

    const infiniteData = useInfiniteList(data)

    const isScrollable = useIsScrollable(infiniteData ?? [])

    const onClickStack = useCallback(
        (id: number) => () => {
            vibrateOnClick()
            setSelectedStack(id)
            stackViewModal.open()
        },
        [stackViewModal],
    )

    const onClickTranslation = useCallback(
        (id: number) => () => {
            vibrateOnClick()
            setSelectedTranslation(id)
            translationViewModal.open()
        },
        [translationViewModal],
    )

    const onClickAddTranslation = useCallback(
        (id: number) => () => {
            vibrateOnClick()
            setSelectedTranslation(id)
            translationAddModal.open()
        },
        [translationAddModal],
    )

    useEffect(() => {
        if (isLoading) return

        if (!isScrollable && hasNextPage) {
            fetchNextPage()
        }
    }, [fetchNextPage, hasNextPage, isLoading, isScrollable, infiniteData])

    return (
        <>
            <PanelHeader children={"Новое"} />

            <InfiniteScroll
                dataLength={infiniteData?.length ?? 0}
                hasMore={hasNextPage}
                next={fetchNextPage}
                loader={<></>}
                className="py-3 px-3"
            >
                <div
                    className="grid gap-3"
                    style={{
                        gridAutoRows: 100,
                        gridAutoFlow: "dense",
                        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                    }}
                >
                    {infiniteData?.map((x, i) =>
                        x.type === "stack" ? (
                            <div className="row-span-2" key={i}>
                                <LargeStackCard
                                    title={x.stackData.name}
                                    translationsCount={x.stackData.translationsCount}
                                    onClick={onClickStack(x.stackData.id)}
                                    isVerified={x.stackData.isVerified}
                                    encodedBackground={encodeStackBackground(x.stackData)}
                                />
                            </div>
                        ) : x.type === "translation" ? (
                            <div className="row-span-1" key={i}>
                                <FeedTranslationCard
                                    foreign={x.translationData.foreign}
                                    vernacular={x.translationData.vernacular}
                                    authorName={x.translationData.author.firstName ?? ""}
                                    authorAvatarUrl={
                                        getSuitableAvatarUrl(
                                            x.translationData.author.avatarUrls,
                                            32,
                                        ) ?? ""
                                    }
                                    onClick={onClickTranslation(x.translationData.id)}
                                    onAdd={onClickAddTranslation(x.translationData.id)}
                                    onShowMore={() => {}}
                                />
                            </div>
                        ) : (
                            <></>
                        ),
                    )}
                </div>
                {isLoading && <Spinner className="py-12" />}
            </InfiniteScroll>

            <Spacing size={256} />

            <ModalWrapper isOpened={stackViewModal.isOpened} onClose={stackViewModal.close}>
                <ModalBody fullscreen={true}>
                    {selectedStack && <StackView id={selectedStack} />}
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper
                isOpened={translationAddModal.isOpened}
                onClose={translationAddModal.close}
            >
                <ModalBody fullscreen={true}>
                    {selectedTranslation && (
                        <TranslationAddToStack
                            translationId={selectedTranslation}
                            onClose={translationAddModal.close}
                        />
                    )}
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
