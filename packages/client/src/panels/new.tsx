import { Icon24ChevronDown, Icon24Refresh } from "@vkontakte/icons"
import bridge, { BannerAdLocation } from "@vkontakte/vk-bridge"
import { PanelHeader, Spacing } from "@vkontakte/vkui"
import { useCallback, useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useTimeout, useToggle, useUnmount } from "usehooks-ts"
import { LargeStackCard } from "../entities/stack/ui/large-stack-card"
import { FeedTranslationCard } from "../entities/translation/ui/feed-translation-card"
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
import { TranslationAddToStack } from "../widgets/translation-add-to-stack"
import { TranslationView } from "../widgets/translation-view"

const ReleaseToRefresh = () => {
    useEffect(() => {
        vibrateOnClick()
    })

    return (
        <div className={"py-4 opacity-60 flex items-center justify-center gap-2"}>
            <Icon24Refresh className={"animate-spin"} />
            <span>Отпустите для обновления</span>
        </div>
    )
}

export const New = () => {
    const [selectedStack, setSelectedStack] = useState<number | null>(null)
    const stackViewModal = useModalState()
    const playModal = useModalState()

    const [selectedTranslation, setSelectedTranslation] = useState<number | null>(null)
    const translationViewModal = useModalState()
    const translationAddModal = useModalState()

    const [adsShown, _, setToggleAdsShown] = useToggle()

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

    useUnmount(() => {
        bridge.send("VKWebAppHideBannerAd")
        setToggleAdsShown(false)
    })

    return (
        <>
            <PanelHeader children={"Новое"} />

            <SearchBar />

            <InfiniteScroll
                pullDownToRefresh
                pullDownToRefreshContent={
                    <div className={"py-4 opacity-60 flex items-center justify-center gap-2"}>
                        <Icon24ChevronDown />
                        <span>Тяните для обновления</span>
                    </div>
                }
                releaseToRefreshContent={<ReleaseToRefresh />}
                pullDownToRefreshThreshold={100}
                refreshFunction={refetch}
                dataLength={infiniteData?.length ?? 0}
                hasMore={hasNextPage}
                next={() => {
                    fetchNextPage()

                    if (!adsShown) {
                        bridge.send("VKWebAppShowBannerAd", {
                            banner_location: BannerAdLocation.BOTTOM,
                            can_close: true,
                        })
                        setToggleAdsShown(true)
                    }
                }}
                loader={Array.from({ length: 30 }).map((_, i) => (
                    <div
                        className={"row-span-2 animate-pulse bg-vk-secondary rounded-xl"}
                        key={i}
                    />
                ))}
                className={"py-3 px-3"}
            >
                <div
                    className={"grid gap-3"}
                    // ref={gridRef}
                    style={{
                        gridAutoRows: 100,
                        gridAutoFlow: "dense",
                        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                    }}
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
                                    <LargeStackCard
                                        title={x.stackData.name}
                                        translationsCount={x.stackData.translationsCount}
                                        isVerified={x.stackData.isVerified}
                                        encodedBackground={x.stackData.encodedBackground}
                                        onClick={onClickStack(x.stackData.id)}
                                        onPlay={onPlayStack(x.stackData.id)}
                                    />
                                </div>
                            ) : x.type === "translation" ? (
                                <div className={"row-span-1"} key={i}>
                                    <FeedTranslationCard
                                        foreign={x.translationData.foreign}
                                        vernacular={x.translationData.vernacular}
                                        authorName={x.translationData.author.firstName ?? ""}
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
