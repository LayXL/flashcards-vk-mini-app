import { Button, Div, ModalPageHeader, PanelHeaderBack, Subhead, Text } from "@vkontakte/vkui"
import { useCallback } from "react"
import AchievementIcon from "../assets/icons/achievement.svg?react"
import ClockIcon from "../assets/icons/clock.svg?react"
import DonateIcon from "../assets/icons/donate.svg?react"
import { ModalBody } from "../features/modal/ui/modal-body"
import { ModalWrapper } from "../features/modal/ui/modal-wrapper"
import { trpc } from "../shared/api"
import { cn } from "../shared/helpers/cn"
import { useModalState } from "../shared/hooks/useModalState"
import { GameResults } from "./game-results"
import { InGame } from "./in-game"

type PlayRankedGameProps = {
    onClose?: () => void
}

export const PlayRankedGame = ({ onClose }: PlayRankedGameProps) => {
    const utils = trpc.useUtils()

    const gameModal = useModalState()
    const gameResultsModal = useModalState(false, {
        onClose: () => {
            utils.game.getRatingAttemptsLeftToday.invalidate()
        },
    })

    const {
        mutate: start,
        data,
        isPending,
    } = trpc.game.start.useMutation({
        onSuccess: () => {
            gameModal.open()
        },
    })

    const { mutate: end } = trpc.game.end.useMutation()

    const startGame = useCallback(() => {
        start({ type: "ranked" })
    }, [start])

    const stopGame = useCallback(() => {
        gameModal.close()
    }, [gameModal])

    const endGame = useCallback(() => {
        end()
        gameModal.close()
        gameResultsModal.open()
    }, [end, gameModal, gameResultsModal])

    return (
        <>
            <ModalPageHeader
                before={<PanelHeaderBack onClick={onClose} />}
                children={"Рейтинг"}
                className={"z-10"}
            />

            <div className={"flex justify-center relative select-none"}>
                <div className={"opacity-40 dark:opacity-80"}>
                    {/* <div className={"animate-[pulse_4s_1s_cubic-bezier(0.4,_0,_0.6,_1)_infinite]"}> */}
                    <div
                        className={cn(
                            // "animate-[fade-in__0.6s_0.3s_ease-in-out_forwards]",
                            "absolute w-[360px] aspect-square -z-1 left-1/2 -translate-x-1/2 -top-[160px] rounded-full"
                        )}
                        style={{
                            background: `radial-gradient(
                                50% 50% at 50% 50%,
                                #ff3a7263 0%,
                                #FF3A7200 100%
                            )`,
                        }}
                    />
                    {/* </div> */}
                </div>
                <img src={"/cat.svg"} alt={""} className={"z-10"} />
            </div>

            <Div className={"py-3 flex flex-col gap-6 select-none"}>
                <div className={"flex gap-4"}>
                    <AchievementIcon />
                    <div className={"flex flex-1 flex-col gap-[2px]"}>
                        <Text weight={"2"} children={"Испытай свои знания"} />
                        <Subhead
                            className={"text-secondary"}
                            children={
                                "Решай карточки, выбирая правильный перевод слова из двух вариантов."
                            }
                        />
                    </div>
                </div>
                <div className={"flex gap-4"}>
                    <ClockIcon />
                    <div className={"flex flex-1 flex-col gap-[2px]"}>
                        <Text weight={"2"} children={"Брось вызов времени"} />
                        <Subhead
                            className={"text-secondary"}
                            children={
                                "У тебя 60 секунд, чтобы выбрать как можно больше верных ответов."
                            }
                        />
                    </div>
                </div>
                <div className={"flex gap-4"}>
                    <DonateIcon />
                    <div className={"flex flex-1 flex-col gap-[2px]"}>
                        <Text weight={"2"} children={"Покажи свои результаты"} />
                        <Subhead
                            className={"text-secondary"}
                            children={
                                "По завершении игры ты увидишь свой результат и очки в рейтинге."
                            }
                        />
                    </div>
                </div>
            </Div>

            <Div>
                <Button
                    children={"Играть"}
                    stretched={true}
                    onClick={startGame}
                    size={"l"}
                    disabled={isPending}
                />
                <div className={"h-safe-area-bottom"} />
            </Div>

            <ModalWrapper isOpened={gameModal.isOpened} onClose={stopGame}>
                <ModalBody fullscreen={true}>
                    {data && <InGame onEndGame={endGame} onStopGame={stopGame} data={data} />}
                </ModalBody>
            </ModalWrapper>

            <ModalWrapper
                isOpened={gameResultsModal.isOpened}
                onClose={() => {
                    onClose?.()
                    gameResultsModal.close()
                }}
            >
                <ModalBody fullscreen={true} disableDragToClose>
                    <GameResults
                        id={data?.gameSession.id ?? 0}
                        onClose={() => {
                            onClose?.()
                            gameResultsModal.close()
                            utils.game.getRatingAttemptsLeftToday.invalidate()
                        }}
                    />
                </ModalBody>
            </ModalWrapper>
        </>
    )
}
