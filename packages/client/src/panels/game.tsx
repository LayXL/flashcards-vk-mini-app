import {
    Icon24Play,
    Icon28Cards2Outline,
    Icon28CupOutline,
    Icon28Like,
    Icon28LikeFillRed,
} from "@vkontakte/icons"
import bridge, { EAdsFormats } from "@vkontakte/vk-bridge"
import {
    Button,
    ButtonGroup,
    Div,
    Group,
    Header,
    PanelHeader,
    Placeholder,
    Spacing,
    Tabs,
    TabsItem,
    Title,
} from "@vkontakte/vkui"
import { useState } from "react"
import { LargeStackCard } from "../entities/stack/ui/large-stack-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWindow } from "../features/modal/ui/modal-window"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { GetAdditionalAttempt } from "../widgets/get-additional-attempt"
import { Leaderboard } from "../widgets/leaderboard"
import { PlayGame } from "../widgets/play-game"
import { PlayRankedGame } from "../widgets/play-ranked-game"
import { StackView } from "../widgets/stack-view"

export const Game = () => {
    // const { data: recentlyGames } = trpc.game.getRecentlyGames.useQuery()

    const utils = trpc.useUtils()

    const playGameModal = useModalState()
    const ratingModal = useModalState()

    const [type, setType] = useState<"default" | "ranked">("ranked")

    const { data: ratingAttemptsLeft, refetch } = trpc.game.getRatingAttemptsLeftToday.useQuery(
        undefined,
        {
            enabled: type === "ranked",
        }
    )

    const { data: recentlyStacks } = trpc.game.getRecentlyStacks.useQuery(undefined, {
        enabled: type === "default",
    })

    const { data: hasAdditionalAttempt } = trpc.game.hasAdditionalAttempt.useQuery(undefined, {
        enabled: type === "ranked",
    })

    const { mutate: getAdditionalAttempt } = trpc.game.getAdditionalAttempt.useMutation({
        onSuccess: () => {
            refetch()
            utils.game.hasAdditionalAttempt.setData(undefined, true)
        },
    })

    const [selectedStack, setSelectedStack] = useState<number | null>(null)

    const viewStackModal = useModalState(false, {
        onClose: () => setSelectedStack(null),
    })

    return (
        <>
            <PanelHeader children={"Играть"} />
            <Tabs>
                <TabsItem
                    onClick={() => setType("ranked")}
                    selected={type === "ranked"}
                    children={"Рейтинг"}
                />
                <TabsItem
                    onClick={() => setType("default")}
                    selected={type === "default"}
                    children={"Обычная игра"}
                />
            </Tabs>
            {type === "default" && (
                <>
                    <Group className={"animate-fade-in"}>
                        <Placeholder
                            icon={
                                <Icon28Cards2Outline
                                    width={56}
                                    height={56}
                                    className={"text-accent"}
                                />
                            }
                            header={"Закрепляй знания"}
                            children={
                                <span className={"text-balance"}>
                                    Узнавай новые слова и&nbsp;запоминай старые с&nbsp;помощью игры,
                                    где&nbsp;нужно на&nbsp;время выбирать правильный перевод
                                </span>
                            }
                            action={
                                <ButtonGroup mode={"vertical"} align={"center"}>
                                    <Button
                                        before={<Icon24Play />}
                                        size={"l"}
                                        children={"Начать игру"}
                                        onClick={playGameModal.open}
                                    />
                                </ButtonGroup>
                            }
                        />
                    </Group>
                    {(recentlyStacks?.length ?? 0) > 0 && (
                        <Group>
                            <Header children={"Недавние стопки"} />
                            <Div className={"gap-3 grid grid-cols-cards"}>
                                {recentlyStacks?.map((stack) => (
                                    <LargeStackCard
                                        key={stack.id}
                                        title={stack.name}
                                        translationsCount={stack.translationsCount}
                                        encodedBackground={stack.encodedBackground}
                                        isVerified={stack.isVerified}
                                        onClick={() => {}}
                                        onPlay={() => {}}
                                    />
                                ))}
                            </Div>
                            <Spacing size={64} />
                        </Group>
                    )}
                </>
            )}
            {type === "ranked" && (
                <>
                    <Group className={"animate-fade-in"}>
                        <Div className={"flex justify-between"}>
                            <Title children={"Попытки на сегодня"} level={"3"} weight={"2"} />

                            <div className={"flex gap-1.5 text-dynamic-red"}>
                                {Array.from({ length: ratingAttemptsLeft ?? 0 }).map((_, i) =>
                                    i === 0 && hasAdditionalAttempt ? (
                                        <Icon28Like key={i} className={"text-amber-400"} />
                                    ) : (
                                        <Icon28LikeFillRed key={i} />
                                    )
                                )}
                                {Array.from({
                                    length:
                                        (hasAdditionalAttempt ? 4 : 3) - (ratingAttemptsLeft ?? 0),
                                }).map((_, i) => (
                                    <Icon28Like key={i} className={"text-secondary"} />
                                ))}
                            </div>
                        </Div>
                        <Placeholder
                            icon={
                                <Icon28CupOutline
                                    width={56}
                                    height={56}
                                    className={"text-accent"}
                                />
                            }
                            header={"Соревнуйся"}
                            children={
                                <span className={"text-balance"}>
                                    Получай баллы и&nbsp;поднимайся в&nbsp;таблице лидеров
                                </span>
                            }
                            action={
                                <ButtonGroup mode={"vertical"} align={"center"}>
                                    <Button
                                        before={<Icon24Play />}
                                        size={"l"}
                                        children={"Начать игру"}
                                        onClick={playGameModal.open}
                                    />
                                </ButtonGroup>
                            }
                        />
                    </Group>
                    <Group className={"animate-fade-in"}>
                        <Leaderboard minimized defaultTab={"global"} />
                        <Div>
                            <Button
                                mode={"outline"}
                                children={"Перейти к рейтингу"}
                                onClick={ratingModal.open}
                                stretched
                                size={"l"}
                                className={"max-w-96 mx-auto"}
                            />
                        </Div>
                        <Spacing size={128} />
                    </Group>
                </>
            )}
            <TabBar />
            <ModalWrapper isOpened={playGameModal.isOpened} onClose={playGameModal.close}>
                {type === "ranked" && ratingAttemptsLeft === 0 ? (
                    <GetAdditionalAttempt
                        isExtraEffort={!!hasAdditionalAttempt}
                        onClose={playGameModal.close}
                        onAction={() => {
                            bridge
                                .send("VKWebAppShowNativeAds", {
                                    ad_format: EAdsFormats.REWARD,
                                })
                                .then(() => {
                                    getAdditionalAttempt()
                                })
                        }}
                    />
                ) : (
                    <ModalBody fullscreen={type === "default"}>
                        {type === "default" && <PlayGame onClose={playGameModal.close} />}
                        {type === "ranked" && ratingAttemptsLeft !== 0 && (
                            <PlayRankedGame onClose={playGameModal.close} />
                        )}
                    </ModalBody>
                )}
            </ModalWrapper>
            <ModalWrapper isOpened={viewStackModal.isOpened} onClose={viewStackModal.close}>
                <ModalBody fullscreen={true}>
                    {selectedStack && <StackView id={selectedStack} />}
                </ModalBody>
            </ModalWrapper>
            <ModalWindow {...ratingModal} fullscreen={true}>
                <Leaderboard onClose={ratingModal.close} />
            </ModalWindow>
        </>
    )
}
