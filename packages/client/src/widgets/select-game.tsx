import { Icon16Like, Icon24ChevronDown } from "@vkontakte/icons"
import bridge, { EAdsFormats } from "@vkontakte/vk-bridge"
import { Button, Div, Group, Header } from "@vkontakte/vkui"
import { GameModeCard } from "../entities/game/ui/game-mode-card"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWindow } from "../features/modal/ui/modal-window"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { useModalState } from "../shared/hooks/useModalState"
import { Categories } from "./categories"
import { FiveLetters } from "./five-letters"
import { GetAdditionalAttempt } from "./get-additional-attempt"
import { Leaderboard } from "./leaderboard"
import { PlayGame } from "./play-game"
import { PlayRankedGame } from "./play-ranked-game"
import { StoriesFeed } from "./stories-feed"

export const SelectGame = () => {
    const utils = trpc.useUtils()

    const playOfficialStacksModal = useModalState()
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

    return (
        <>
            <Group>
                <StoriesFeed />

                <Div
                    className={
                        "max-w-[390px] md:grid-cols-6 md:max-w-[940px] mx-auto grid grid-cols-3 gap-x-3 gap-y-6"
                    }
                >
                    <GameModeCard
                        title={"Изучение"}
                        cover={<div className={"bg-learning-red rounded-xl aspect-square"}></div>}
                        onClick={playOfficialStacksModal.open}
                    />
                    <GameModeCard
                        className={"col-span-2"}
                        title={"Рейтинговая игра"}
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
                        cover={<div className={"bg-learning-red rounded-xl h-full w-full"}></div>}
                        onClick={playRatingGameModal.open}
                    />
                    <GameModeCard
                        className={"col-span-2"}
                        title={"Пять букв"}
                        cover={<div className={"bg-learning-red rounded-xl h-full w-full"}></div>}
                        onClick={playFiveLettersGameModal.open}
                    />
                    <GameModeCard
                        title={"Обычная игра"}
                        cover={<div className={"bg-learning-red rounded-xl aspect-square"}></div>}
                        onClick={playDefaultGameModal.open}
                    />
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

            <ModalWindow {...playOfficialStacksModal} fullscreen title={"Изучение"}>
                <Categories />
            </ModalWindow>

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
