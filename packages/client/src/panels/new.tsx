import { Group, PanelHeader, PullToRefresh, Spacing } from "@vkontakte/vkui"
import { useCallback, useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useTimeout } from "usehooks-ts"
import { StackCard } from "../entities/stack/ui/stack-card"
import { TranslationCard } from "../entities/translation/ui/translation-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { SearchBar } from "../features/search/ui/search-bar"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { cn } from "../shared/helpers/cn"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"
import { vibrateOnClick } from "../shared/helpers/vibrate"
import useInfiniteList from "../shared/hooks/useInfiniteList"
import { useIsScrollable } from "../shared/hooks/useIsScrollable"
import { useModalState } from "../shared/hooks/useModalState"
import { PlayGame } from "../widgets/play-game"
import { StackView } from "../widgets/stack-view"
import { StoriesFeed } from "../widgets/stories-feed"
import { TranslationAddToStack } from "../widgets/translation-add-to-stack"
import { TranslationView } from "../widgets/translation-view"

export const New = () => {
    const [selectedStack, setSelectedStack] = useState<number | null>(null)
    const stackViewModal = useModalState()
    const playModal = useModalState()

    const [selectedTranslation, setSelectedTranslation] = useState<number | null>(null)
    const translationViewModal = useModalState()
    const translationAddModal = useModalState()

    const { data, fetchNextPage, hasNextPage, isSuccess, isLoading, isFetching, refetch } =
        trpc.feed.get.useInfiniteQuery(
            {},
            {
                getNextPageParam: ({ cursor }) => cursor,
                refetchOnMount: false,
                refetchOnWindowFocus: false,
            }
        )

    const [isAnimationCompleted, setIsAnimationCompleted] = useState(isSuccess)

    const infiniteData = useInfiniteList(data)

    const isScrollable = useIsScrollable(infiniteData ?? [])

    const onClickStack = useCallback(
        (id: number) => () => {
            vibrateOnClick()
            setSelectedStack(id)
            stackViewModal.open()
        },
        [stackViewModal]
    )

    const onPlayStack = useCallback(
        (id: number) => () => {
            vibrateOnClick()
            setSelectedStack(id)
            playModal.open()
        },
        [playModal]
    )

    const onClickTranslation = useCallback(
        (id: number) => () => {
            vibrateOnClick()
            setSelectedTranslation(id)
            translationViewModal.open()
        },
        [translationViewModal]
    )

    const onClickAddTranslation = useCallback(
        (id: number) => () => {
            vibrateOnClick()
            setSelectedTranslation(id)
            translationAddModal.open()
        },
        [translationAddModal]
    )

    useTimeout(() => setIsAnimationCompleted(true), 600)

    useEffect(() => {
        if (isLoading || isFetching) return

        if (!isScrollable && hasNextPage) fetchNextPage()
    }, [fetchNextPage, hasNextPage, isLoading, isFetching, isScrollable, infiniteData])

    return (
        <>
            <PanelHeader children={"Новое"} />

            <SearchBar />

            <PullToRefresh
                onRefresh={() => {
                    refetch()
                    vibrateOnClick()
                }}
                isFetching={isFetching}
            >
                <Group>
                    <StoriesFeed />
                </Group>
                <Group>
                    <InfiniteScroll
                        dataLength={infiniteData?.length ?? 0}
                        hasMore={hasNextPage}
                        next={() => {
                            fetchNextPage()
                        }}
                        loader={Array.from({ length: 30 }).map((_, i) => (
                            <div
                                className={"row-span-2 animate-pulse bg-vk-secondary rounded-xl"}
                                key={i}
                            />
                        ))}
                        className={"px-3"}
                    >
                        <div
                            className={
                                "grid grid-cols-cards gap-3 grid-flow-dense auto-rows-[106px]"
                            }
                        >
                            {(!isSuccess || !isAnimationCompleted) &&
                                Array.from({ length: 30 }).map((_, i) => (
                                    <div className={"row-span-2 animate-pulse"} key={i}>
                                        <div
                                            style={{
                                                "--delay": i * 25 + "ms",
                                            }}
                                            className={cn(
                                                "w-full h-full bg-vk-secondary rounded-xl",
                                                "animate-[slide-in_600ms_var(--delay)_ease_forwards]",
                                                "translate-y-full"
                                            )}
                                        />
                                    </div>
                                ))}
                            {isAnimationCompleted &&
                                infiniteData?.map((x, i) =>
                                    x.type === "stack" ? (
                                        <div className={"row-span-2"} key={i}>
                                            <StackCard
                                                title={x.stackData.name}
                                                translationsCount={x.stackData.translationsCount}
                                                isVerified={x.stackData.isVerified}
                                                encodedBackground={x.stackData.encodedBackground}
                                                onClick={onClickStack(x.stackData.id)}
                                                onPlay={onPlayStack(x.stackData.id)}
                                                authorAvatarUrl={
                                                    getSuitableAvatarUrl(
                                                        x.stackData.author.avatarUrls,
                                                        32
                                                    ) ?? ""
                                                }
                                                authorName={x.stackData.author.firstName}
                                            />
                                        </div>
                                    ) : x.type === "translation" ? (
                                        <div className={"row-span-1"} key={i}>
                                            <TranslationCard
                                                foreign={x.translationData.foreign}
                                                vernacular={x.translationData.vernacular}
                                                authorName={
                                                    x.translationData.author.firstName ?? ""
                                                }
                                                authorAvatarUrl={
                                                    getSuitableAvatarUrl(
                                                        x.translationData.author.avatarUrls,
                                                        32
                                                    ) ?? ""
                                                }
                                                onClick={onClickTranslation(x.translationData.id)}
                                                onAdd={onClickAddTranslation(x.translationData.id)}
                                            />
                                        </div>
                                    ) : (
                                        <></>
                                    )
                                )}
                        </div>
                    </InfiniteScroll>
                </Group>
            </PullToRefresh>

            <Spacing size={256} />

            <ModalWrapper isOpened={stackViewModal.isOpened} onClose={stackViewModal.close}>
                <ModalBody fullscreen={true}>
                    {selectedStack && <StackView id={selectedStack} />}
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper isOpened={playModal.isOpened} onClose={playModal.close}>
                <ModalBody fullscreen={true}>
                    {selectedStack && (
                        <PlayGame stackId={selectedStack} onClose={playModal.close} />
                    )}
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
                <ModalBody fullscreen>
                    {selectedTranslation && (
                        <TranslationView
                            id={selectedTranslation}
                            onClose={translationViewModal.close}
                        />
                    )}
                </ModalBody>
            </ModalWrapper>

            <TabBar />
        </>
    )
}
