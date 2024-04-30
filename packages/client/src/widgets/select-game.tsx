import { Icon16Like, Icon24ChevronDown } from "@vkontakte/icons"
import bridge, { EAdsFormats } from "@vkontakte/vk-bridge"
import { Button, Div, Group, Header } from "@vkontakte/vkui"
import { GameModeCard } from "../entities/game/ui/game-mode-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWindow } from "../features/modal/ui/modal-window"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { FiveLetters } from "./five-letters"
import { GetAdditionalAttempt } from "./get-additional-attempt"
import { Leaderboard } from "./leaderboard"
import { PlayGame } from "./play-game"
import { PlayRankedGame } from "./play-ranked-game"
import { StoriesFeed } from "./stories-feed"

export const SelectGame = () => {
    const utils = trpc.useUtils()

    const playDefaultGameModal = useModalState()
    const playRatingGameModal = useModalState()
    const playFiveLettersGameModal = useModalState()
    const leaderboardModal = useModalState()

    const { data: ratingAttemptsLeft, refetch } = trpc.game.getRatingAttemptsLeftToday.useQuery()

    const { data: hasAdditionalAttempt } = trpc.game.hasAdditionalAttempt.useQuery()

    const { mutate: getAdditionalAttempt } = trpc.game.getAdditionalAttempt.useMutation({
        onSuccess: () => {
            refetch()
            utils.game.hasAdditionalAttempt.setData(undefined, true)
        },
    })

    const type = "ranked"

    return (
        <>
            <Group>
                <StoriesFeed />

                <Div className={"max-w-[380px] mx-auto flex flex-col gap-8"}>
                    <GameModeCard
                        title={"Обычная игра"}
                        caption={"С любой стопкой"}
                        cover={
                            <div className={"bg-learning-red rounded-xl h-36 w-full"}>
                                <p className={"font-['Impact'] text-2xl p-3"}>самая обычная</p>
                            </div>
                        }
                        onClick={playDefaultGameModal.open}
                    />
                    <div className={"flex gap-3 [&>*]:flex-1"}>
                        <GameModeCard
                            title={"Рейтинговая"}
                            caption={
                                ratingAttemptsLeft === 0 && !hasAdditionalAttempt ? (
                                    <span className={"flex gap-1 items-center"}>
                                        1
                                        <Icon16Like className={"text-dynamic-yellow"} />
                                    </span>
                                ) : (
                                    <span className={"flex gap-1 items-center"}>
                                        {ratingAttemptsLeft}
                                        <Icon16Like className={"text-learning-red"} />
                                    </span>
                                )
                            }
                            cover={<div className={"bg-learning-red rounded-xl h-36 w-full"}></div>}
                            onClick={playRatingGameModal.open}
                        />
                        <GameModeCard
                            title={"Пять букв"}
                            // caption={"6"}
                            cover={<div className={"bg-learning-red rounded-xl h-36 w-full"}></div>}
                            onClick={playFiveLettersGameModal.open}
                        />
                    </div>
                </Div>
            </Group>

            <Group>
                <Header children={"Лидеры в рейтинге"} />
                <Leaderboard minimized={true} defaultTab={"global"} />
                <Div>
                    <Button
                        stretched
                        size={"l"}
                        mode={"secondary"}
                        before={<Icon24ChevronDown />}
                        children={"Показать больше"}
                        onClick={leaderboardModal.open}
                    />
                </Div>
            </Group>

            <div className={"h-tabbar-height"} />

            <ModalWindow {...playDefaultGameModal} fullscreen>
                <PlayGame onClose={playDefaultGameModal.close} />
            </ModalWindow>

            <ModalWrapper {...playRatingGameModal}>
                {ratingAttemptsLeft === 0 ? (
                    <GetAdditionalAttempt
                        isExtraEffort={!!hasAdditionalAttempt}
                        onClose={playRatingGameModal.close}
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
                    <ModalBody>
                        <PlayRankedGame onClose={playRatingGameModal.close} />
                    </ModalBody>
                )}
            </ModalWrapper>

            <ModalWindow {...playFiveLettersGameModal} fullscreen>
                <FiveLetters onClose={playFiveLettersGameModal.close} />
            </ModalWindow>

            <ModalWindow {...leaderboardModal} fullscreen>
                <Leaderboard onClose={leaderboardModal.close} />
            </ModalWindow>
        </>
    )
}
